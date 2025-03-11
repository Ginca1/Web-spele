<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use App\Models\Privilege;

class SkipController extends Controller
{
    public function useSkip(Request $request)
    {
        try {
            $privilege = Privilege::where('user_id', $request->user_id)->first();

            if (!$privilege) {
                return response()->json(['message' => 'Privilege not found.'], 404);
            }

            if ($privilege->skip_quantity > 0) {
                $privilege->skip_quantity -= 1;
                $privilege->save();

                return response()->json([
                    'skip_quantity' => $privilege->skip_quantity
                ]);
            } else {
                return response()->json([
                    'message' => 'No skips left.'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to use skip.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}

