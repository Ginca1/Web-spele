<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $messages = [
            'current_password.required' => 'Lūdzu ievadiet pašreizējo paroli.',
            'current_password.current_password' => 'Pašreizējā parole nav pareiza.',
            'password.required' => 'Lūdzu ievadiet jaunu paroli.',
            'password.confirmed' => 'Jaunās paroles apstiprinājums nesakrīt.',
        ];
    
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', \Illuminate\Validation\Rules\Password::defaults(), 'confirmed'],
        ], $messages);
    
        $request->user()->update([
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);
    
        return back()->with('success', 'Parole veiksmīgi atjaunota.');
    }
    
}
