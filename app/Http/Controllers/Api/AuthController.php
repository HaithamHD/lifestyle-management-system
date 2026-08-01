<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->validated());
        $token = $user->createToken('web', ['user'])->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $email = (string) $request->string('email');
        $password = (string) $request->string('password');
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages(['email' => 'The provided credentials are incorrect.']);
        }

        if (! $user->isActive()) {
            throw ValidationException::withMessages(['email' => 'Your account is suspended.']);
        }

        $user->forceFill(['last_login_at' => now()])->save();
        $token = $user->createToken($request->userAgent() ?: 'web', [$user->isAdmin() ? 'admin' : 'user'])->plainTextToken;

        return response()->json(['user' => $user->fresh(), 'token' => $token]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Signed out.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'avatar_url' => ['sometimes', 'nullable', 'url', 'max:500'],
            'password' => ['sometimes', 'confirmed', 'min:8'],
        ]);

        $user->update($data);
        return response()->json(['message' => 'Profile updated.', 'user' => $user->fresh()]);
    }
}
