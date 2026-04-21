<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        $middleware->alias([
            'api.auth' => \App\Http\Middleware\ApiAuthenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['status' => 'not-found', 'message' => 'Not found'], 404);
            }
        });
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['status' => 'unauthenticated', 'message' => 'Missing token'], 401);
            }
        });
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                $violations = [];
                foreach ($e->errors() as $field => $messages) {
                    $violations[$field] = ['message' => $messages[0]];
                }
                return response()->json([
                    'status' => 'invalid',
                    'message' => 'Request body is not valid.',
                    'violations' => $violations,
                ], 400);
            }
        });
    })->create();
