<?php

namespace App\Http\Middleware;

use App\Models\Administrator;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class ApiAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'status' => 'unauthenticated',
                'message' => 'Missing token',
            ], 401);
        }

        $tokenValue = substr($authHeader, 7);

        if (!str_contains($tokenValue, '|')) {
            return response()->json([
                'status' => 'unauthenticated',
                'message' => 'Invalid token',
            ], 401);
        }
        [$tokenId, $plainToken] = explode('|', $tokenValue, 2);
        $hashedToken = hash('sha256', $plainToken);

        $tokenModel = PersonalAccessToken::where('id', $tokenId)->where('token', $hashedToken)->first();

        if (!$tokenModel || !$tokenModel->tokenable) {
            return response()->json([
                'status' => 'unauthenticated',
                'message' => 'Invalid token',
            ], 401);
        }

        $tokenable = $tokenModel->tokenable;

        if ($tokenable instanceof User) {
            $freshUser = User::withTrashed()->find($tokenable->id);
            if ($freshUser && $freshUser->deleted_at !== null) {
                return response()->json([
                    'status' => 'blocked',
                    'message' => 'User blocked',
                    'reason' => $freshUser->delete_reason ?? 'You have been blocked by an administrator',
                ], 403);
            }
        }

        $request->setUserResolver(function () use ($tokenable) {
            return $tokenable;
        });

        return $next($request);
    }
}
