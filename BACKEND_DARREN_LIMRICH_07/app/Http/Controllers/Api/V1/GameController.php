<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameVersion;
use App\Models\Score;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class GameController extends Controller
{

    private function fmt($dt): string
    {
        return $dt ? Carbon::parse($dt)->utc()->format('Y-m-d\TH:i:s.000\Z') : '';
    }

    private function thumbnail(Game $game, GameVersion $version): ?string
    {
        $path = public_path("games/{$game->slug}/{$version->version}/thumbnail.png");
        return File::exists($path) ? "/games/{$game->slug}/{$version->version}/thumbnail.png" : null;
    }


    public function index(Request $request)
    {
        $page    = max(0, (int) $request->query('page', 0));
        $size    = max(1, (int) $request->query('size', 10));
        $sortBy  = $request->query('sortBy', 'title');
        $sortDir = in_array($request->query('sortDir', 'asc'), ['asc', 'desc'])
            ? $request->query('sortDir', 'asc') : 'asc';

        $query = Game::whereNull('deleted_at')
            ->whereHas('latestVersion')
            ->with(['author', 'latestVersion']);

        if ($sortBy === 'popular') {
            $query->withCount('scores as score_count')->orderBy('score_count', $sortDir);
        } elseif ($sortBy === 'uploaddate') {
            $query->addSelect([
                'latest_version_ts' => GameVersion::select('created_at')
            ->whereColumn('game_id', 'games.id')
                    ->orderByDesc('id')
                    ->limit(1),
            ])->orderBy('latest_version_ts', $sortDir);
        } else {
            $query->orderBy('title', $sortDir);
        }

        $total   = (clone $query)->count();
        $games   = $query->skip($page * $size)->take($size)->get();

        $content = $games->map(function ($game) {
            $latest = $game->latestVersion;
            return [
                'slug'            => $game->slug,
                'title'           => $game->title,
                'description'     => $game->description,
                'thumbnail'       => $latest ? $this->thumbnail($game, $latest) : null,
                'uploadTimestamp' => $latest ? $this->fmt($latest->created_at) : null,
                'author'          => $game->author?->username,
                'scoreCount'      => $game->scores()->count(),
            ];
        });

        return response()->json([
            'page'          => $page,
            'size'          => $content->count(),
            'totalElements' => $total,
            'content'       => $content,
        ], 200);
    }


    public function store(Request $request)
    {
        $request->validate(
            [
                'title'       => 'required|min:3|max:60',
                'description' => 'required|max:200',
            ],
            [
                'title.required'       => 'required',
                'title.min'            => 'must be at least 3 characters long',
                'title.max'            => 'must be at most 60 characters long',
                'description.required' => 'required',
                'description.max'      => 'must be at most 200 characters long',
            ]
        );

        $slug = Str::slug($request->title);

        if (Game::withTrashed()->where('slug', $slug)->exists()) {
            return response()->json([
                'status' => 'invalid',
            'slug' => 'Game title already exists'
            ], 400);
        }

        $game = Game::create([
            'title'       => $request->title,
            'slug'        => $slug,
            'description' => $request->description,
            'created_by'  => $request->user()->id,
        ]);

            return response()->json([
                'status' => 'success',
                'slug' => $game->slug
            ], 201);
        }


    public function show(Request $request, $slug)
    {
        $game = Game::whereNull('deleted_at')->where('slug', $slug)
            ->with(['author', 'latestVersion'])->first();

        if (!$game) {
            return response()->json([
                'status'=>'not-found',
                'messsage' => 'not-found'
            ]);     
        }

        $latest = $game->latestVersion;

        return response()->json([
            'slug'            => $game->slug,
            'title'           => $game->title,
            'description'     => $game->description,
            'thumbnail'       => $latest ? $this->thumbnail($game, $latest) : null,
            'uploadTimestamp' => $latest ? $this->fmt($latest->created_at) : null,
            'author'          => $game->author?->username,
            'scoreCount'      => $game->scores()->count(),
            'gamePath'        => $latest ? "/games/{$game->slug}/{$latest->version}/" : null, 
        ], 200);
    }


    public function upload(Request $request, $slug)
    {
        $tokenValue = $request->input('token');
        if (!$tokenValue || !str_contains($tokenValue, '|')) {
            return response('Token is required', 401)->header('Content-Type', 'text/plain');
        }

        [$tokenId, $plainToken] = explode('|', $tokenValue, 2);
        $tokenModel = PersonalAccessToken::where('id', $tokenId)
            ->where('token', hash('sha256', $plainToken))
            ->first();

        if (!$tokenModel || !$tokenModel->tokenable) {
            return response('Invalid token', 401)->header('Content-Type', 'text/plain');
        }

        $uploader = $tokenModel->tokenable;

        $game = Game::whereNull('deleted_at')->where('slug', $slug)->first();
        if (!$game) {
            return response('Game not found', 404)->header('Content-Type', 'text/plain');
        }

        if (!($uploader instanceof User) || $uploader->id !== $game->created_by) {
            return response('User is not author of the game', 403)->header('Content-Type', 'text/plain');
        }

        if (!$request->hasFile('zipfile')) {
            return response('zipfile is required', 400)->header('Content-Type', 'text/plain');
        }

        $latest      = GameVersion::where('game_id', $game->id)->orderByDesc('id')->first();
        $nextVersion = $latest ? ($latest->version + 1) : 1;

        $destPath = public_path("games/{$game->slug}/{$nextVersion}");
        File::ensureDirectoryExists($destPath);

        $tmpPath  = $request->file('zipfile')->getRealPath();
        $zipCopy  = $tmpPath . '_upload.zip';
        copy($tmpPath, $zipCopy);
        $cmd = 'powershell -NoProfile -Command "Expand-Archive -LiteralPath \''
            . str_replace('/', '\\', $zipCopy) . '\' -DestinationPath \''
            . str_replace('/', '\\', $destPath) . '\' -Force" 2>&1';
        exec($cmd, $out, $code);
        @unlink($zipCopy);

        if ($code !== 0) {
            return response('Failed to extract zip: ' . implode(' ', $out), 400)
                ->header('Content-Type', 'text/plain');
        }

        if ($request->hasFile('thumbnail')) {
            $request->file('thumbnail')->move($destPath, 'thumbnail.png');
        }

        GameVersion::create([
            'game_id'      => $game->id,
            'version'      => $nextVersion,
            'storage_path' => "games/{$game->slug}/{$nextVersion}",
        ]);

        $game->touch();

            return response()->json([
                'status' => 'success'
            ], 200);
        }


    public function update(Request $request, $slug)
    {
        $game = Game::whereNull('deleted_at')->where('slug', $slug)->first();
        if (!$game) {
            return response()->json([
                'status' => 'not-found',
                'message' => 'Not found'
            ], 404);
        }

        if (!($request->user() instanceof User) || $request->user()->id !== $game->created_by) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'You are not the game author'
            ], 403);
        }

        $request->validate(
            [
                'title'       => 'sometimes|min:3|max:60',
                'description' => 'sometimes|max:200',
            ],
            [
                'title.min'        => 'must be at least 3 characters long',
                'title.max'        => 'must be at most 60 characters long',
                'description.max'  => 'must be at most 200 characters long',
            ]
        );

        if ($request->filled('title'))       
            $game->title       = $request->title;
        if ($request->filled('description')) 
            $game->description = $request->description;
        $game->save();

        return response()->json([
            'status' => 'success'
        ]. 200);
    }


    public function destroy(Request $request, $slug)
    {
        $game = Game::whereNull('deleted_at')->where('slug', $slug)->first();
        if (!$game) {
            return response()->json([
                    'status' => 'not-found',
                    'message' => 'Not found' 
            ], 404);
        }

        if (!($request->user() instanceof User) || $request->user()->id !== $game->created_by) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'You are not the game author'
            ], 403);
        }

        $versionIds = GameVersion::where('game_id', $game->id)->pluck('id');
        Score::whereIn('game_version_id', $versionIds)->delete();
        GameVersion::where('game_id', $game->id)->delete();

        $gamePath = public_path("games/{$game->slug}");
        if (File::isDirectory($gamePath)) File::deleteDirectory($gamePath);

        $game->delete();

        return response()->noContent();
    }


    public function scores(Request $request, $slug)
    {
        $game = Game::whereNull('deleted_at')->where('slug', $slug)->first();
        if (!$game) {
            return response()->json([
                'status' => 'not-found',
                'message' => 'Not found'
            ], 404);
        }

        $versionIds = GameVersion::where('game_id', $game->id)->pluck('id');

        $scores = Score::whereIn('game_version_id', $versionIds)
            ->join('users', 'scores.user_id', '=', 'users.id')
            ->selectRaw('users.username, MAX(scores.score) as score, MAX(scores.created_at) as timestamp')
            ->groupBy('scores.user_id', 'users.username')
            ->orderByDesc('score')
            ->get()
            ->map(function ($row) {
                return [
                    'username'  => $row->username,
                    'score'     => (float) $row->score,
                    'timestamp' => $this->fmt($row->timestamp),
                ];
            });

        return response()->json([
            'scores' => $scores
            ], 200);
    }


    public function submitScore(Request $request, $slug)
    {
        $game = Game::whereNull('deleted_at')->where('slug', $slug)->first();
        if (!$game) {
            return response()->json([
            'status' => 'not-found', 
            'message' => 'Not found'
            ], 404);
        }

        $latest = $game->latestVersion;
        if (!$latest) {
            return response()->json([
        'status' => 'not-found', 
            'message' => 'Not found'
            ], 404);
        }

        $request->validate(
            ['score' => 'required|numeric'],
            ['score.required' => 'required', 
            'score.numeric' => 'must be a number']
        );

        Score::create([
            'user_id'         => $request->user()->id,
            'game_version_id' => $latest->id,
            'score'           => (float) $request->score,
        ]);

            return response()->json([
                'status' => 'success'
            ],201);
        }
}
