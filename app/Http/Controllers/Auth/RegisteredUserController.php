<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Privilege; // Import the Privilege model
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
      
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => 'Ievadi vārdu.',
            'email.required' => 'Ievadi e-pastu.',
            'password.min' => 'Parolei jābūt ar vismaz 8 rakstzīmēm.',
            'password.required' => 'Ievadi paroli.',
            'password.confirmed' => 'Ievadītās paroles nesakrīt.',
        ]);

      
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'coins' => 2000,
            'picture_id' => rand(1, 3), 
        ]);

        
        Privilege::create([
            'user_id' => $user->id,
            'hint_quantity' => 0,
            'power_quantity' => 0,
            'freeze_quantity' => 0,
        ]);

      
        event(new Registered($user));
        Auth::login($user);

       
        return redirect(route('home'));
    }
}
