<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Administrator;
use App\Models\Game;
use App\Models\Score;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    private function isAdmin(Request $request): bool
    {
        return $request->user() instanceof Administrator;
    }

    private function fmt($dt): string
    {
        return $dt ? Carbon::parse($dt)->utc()->format('Y-m-d\TH:i:s.000\Z') : '';
    }


    public function index(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['status' => 'forbidden', 'message' => 'You are not the administrator'], 403);
        }

        $users = User::withTrashed()->orderBy('created_at')->get()->map(function ($user) {
            return [
                'id'            => $user->id,
                'username'      => $user->username,
                'last_login_at' => $this->fmt($user->last_login_at),
                'created_at'    => $this->fmt($user->created_at),
                'updated_at'    => $this->fmt($user->updated_at),
                'deleted_at'    => $user->deleted_at ? $this->fmt($user->deleted_at) : null,
            ];
        });

        return response()->json([
            'totalElements' => $users->count(),
            'content'       => $users,
        ], 200);
    }


    public function store(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(
                [
                'status' => 'forbidden', 
                'message' => 'You are not the administrator'
                ], 403);
        }

        $request->validate(
            [
                'username' => 'required|min:4|max:60',
                'password' => 'required|min:5|max:10',
            ],
            [
                'username.required' => 'required',
                'username.min'      => 'must be at least 4 characters long',
                'username.max'      => 'must be at most 60 characters long',
                'password.required' => 'required',
                'password.min'      => 'must be at least 5 characters long',
                'password.max'      => 'must be at most 10 characters long',
            ]
        );

        if (User::withTrashed()->where('username', $request->username)->exists()) {
            return response()->json(['status' => 'invalid', 'message' => 'Username already exists'], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(
            ['status' => 'success', 
            'username' => $user->username
            ], 201);
    }


    public function show(Request $request, $username)
    {
        $currentUser = $request->user();
        $isAdmin     = $this->isAdmin($request);
        $isSelf      = $currentUser instanceof User && $currentUser->username === $username;

        $user = $isAdmin
            ? User::withTrashed()->where('username', $username)->first()
            : User::where('username', $username)->whereNull('deleted_at')->first();

        if (!$user) {
            return response()->json(['status' => 'not-found', 'message' => 'Not found'], 404);
        }

        $gamesQuery = Game::where('created_by', $user->id)->whereNull('deleted_at')
            ->with('latestVersion')
            ->withCount('scores as score_count');

        if (!$isSelf && !$isAdmin) {
            $gamesQuery->whereHas('latestVersion');
        }

        $authoredGames = $gamesQuery->get()
            ->sortByDesc(fn($g) => $g->latestVersion?->created_at)
            ->map(function ($game) {
                $latest    = $game->latestVersion;
                $thumbFile = $latest ? public_path("games/{$game->slug}/{$latest->version}/thumbnail.png") : null;
                return [
                    'slug'        => $game->slug,
                    'title'       => $game->title,
                    'description' => $game->description,
                    'thumbnail'   => ($thumbFile && File::exists($thumbFile))
                        ? "/games/{$game->slug}/{$latest->version}/thumbnail.png"
                        : null,
                    'scoreCount'  => $game->score_count,
                ];
            })->values();

        $highscores = Score::where('scores.user_id', $user->id)
            ->join('game_versions', 'scores.game_version_id', '=', 'game_versions.id')
            ->join('games', 'game_versions.game_id', '=', 'games.id')
            ->whereNull('games.deleted_at')
            ->selectRaw('games.slug, games.title, games.description, MAX(scores.score) as score, MAX(scores.created_at) as timestamp')
            ->groupBy('games.id', 'games.slug', 'games.title', 'games.description')
            ->get()
            ->map(function ($row) {
                return [
                    'game'      => [
                        'slug'        => $row->slug,
                        'title'       => $row->title,
                        'description' => $row->description,
                    ],
                    'score'     => (float) $row->score,
                    'timestamp' => $this->fmt($row->timestamp),
                ];
            })->values();

        return response()->json([
            'username'          => $user->username,
            'registeredTimestamp' => $this->fmt($user->created_at),
            'authoredGames'     => $authoredGames,
            'highscores'        => $highscores,
        ], 200);
    }


    public function update(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['status' => 'forbidden', 'message' => 'You are not the administrator'], 403);
        }

        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['status' => 'not-found', 'message' => 'User Not found'], 403);
        }

        $request->validate(
            [
                'username' => 'sometimes|min:4|max:60',
                'password' => 'sometimes|min:5|max:10',
            ],
            [
                'username.min'  => 'must be at least 4 characters long',
                'username.max'  => 'must be at most 60 characters long',
                'password.min'  => 'must be at least 5 characters long',
                'password.max'  => 'must be at most 10 characters long',
            ]
        );

        if ($request->filled('username')) {
            if (User::withTrashed()->where('username', $request->username)->where('id', '!=', $id)->exists()) {
                return response()->json(['status' => 'invalid', 'message' => 'Username already exists'], 400);
            }
            $user->username = $request->username;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['status' => 'success', 'username' => $user->username], 201);
    }


    public function destroy(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['status' => 'forbidden', 'message' => 'You are not the administrator'], 403);
        }

        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['status' => 'not-found', 'message' => 'User Not found'], 403);
        }

        if ($request->query('action') === 'restore') {
            $user->restore();
            $user->delete_reason = null;
            $user->save();
            return response()->noContent();
        }

        if ($request->filled('delete_reason')) {
            $user->delete_reason = $request->delete_reason;
            $user->save();
        }

        $user->delete();

        return response()->noContent();
    }
}
