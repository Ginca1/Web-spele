<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CheckExistenceController extends Controller
{
    public function checkNameExists(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:8'
        ]);

        $exists = User::where('name', $request->name)
                     ->where('id', '!=', auth()->id())
                     ->exists();

        return response()->json(['exists' => $exists]);
    }

    public function checkEmailExists(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $exists = User::where('email', $request->email)
                     ->where('id', '!=', auth()->id())
                     ->exists();

        return response()->json(['exists' => $exists]);
    }

    public function validateCurrentPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string'
        ]);

        return response()->json([
            'isValid' => Hash::check($request->current_password, auth()->user()->password)
        ]);
    }
}