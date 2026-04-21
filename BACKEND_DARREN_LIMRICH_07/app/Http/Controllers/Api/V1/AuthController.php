<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Administrator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate(
            [
                'username' => 'required|min:4|max:60',
                'password' => 'required|min:5|max:10',
            ],
            [
                'username.required' => 'required',
                'username.min' => 'must be at least 4 characters long',
                'username.max' => 'must be at most 60 characters long',
                'password.required' => 'required',
                'password.min' => 'must be at least 5 characters long',
                'password.max' => 'must be at most 10 characters long'
            ]
        );

        if (User::where('username', $request->username)->exists()) {
            return response()->json([
                'status'  => 'invalid',
                'message' => 'Username already exists',
            ], 400);
        }

        $user  = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token'  => $token,
        ], 201);
    }

    public function signin(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $admin = Administrator::where('username', $username)->first();
        if ($admin && Hash::check($password, $admin->password)) {
            $admin->update(['last_login_at' => now()]);
            $token = $admin->createToken('auth_token')->plainTextToken;
            return response()->json(['status' => 'success', 'token' => $token], 200);
        }

        $user = User::withTrashed()->where('username', $username)->first();
        if ($user && Hash::check($password, $user->password)) {
            $user->update(['last_login_at' => now()]);
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json(['status' => 'success', 'token' => $token], 200);
        }

        return response()->json([
            'status'  => 'invalid',
            'message' => 'Wrong username or password',
        ], 401);
    }

    public function signout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'success'
        ], 200);
    }
    
}
