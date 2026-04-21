<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Administrator;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user() instanceof Administrator) {
            return response()->json([
                'status'  => 'forbidden',
                'message' => 'You are not the administrator',
            ], 403);
        }

        $admins = Administrator::orderBy('created_at')->get()->map(function ($admin) {
            return [
                'username'      => $admin->username,
                'last_login_at' => $admin->last_login_at
                    ? $admin->last_login_at->utc()->format('Y-m-d\TH:i:s.000\Z')
                    : '',
                'created_at'    => $admin->created_at->utc()->format('Y-m-d\TH:i:s.000\Z'),
                'updated_at'    => $admin->updated_at->utc()->format('Y-m-d\TH:i:s.000\Z'),
            ];
        });

        return response()->json([
            'totalElements' => $admins->count(),
            'content'       => $admins,
        ], 200);
    }
}
