<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Privilege;
use App\Models\User;

class HintController extends Controller
{
    public function useHint(Request $request)
    {
        try {
            $user = User::findOrFail($request->user_id);
            $privilege = Privilege::where('user_id', $user->id)->first();

            if (!$privilege) {
                return response()->json([
                    'message' => 'Privileges not found for this user.'
                ], 404);
            }

            if ($privilege->hint_quantity > 0) {
                $privilege->hint_quantity -= 1;
                $privilege->save();

                return response()->json([
                    'hint_quantity' => $privilege->hint_quantity
                ]);
            } else {
                return response()->json([
                    'message' => 'No hints left.'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to use hint.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
