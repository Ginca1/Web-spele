<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Privilege;
use App\Models\User;

class FlagController extends Controller
{
    public function useFlag(Request $request)
    {
        try {
            $user = User::findOrFail($request->user_id);
            $privilege = Privilege::where('user_id', $user->id)->first();

            //minusd the flag
            if (!$privilege) {
                return response()->json([
                    'message' => 'Privileges not found for this user.'
                ], 404);
            }

            if ($privilege->flag_quantity > 0) {
                $privilege->flag_quantity -= 1;
                $privilege->save();

                return response()->json([
                    'flag_quantity' => $privilege->flag_quantity
                ]);
            } else {
                return response()->json([
                    'message' => 'No flags left.'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to use flag.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}