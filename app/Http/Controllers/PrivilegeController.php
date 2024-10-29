<?php
namespace App\Http\Controllers;

use App\Models\Privilege;
use Illuminate\Http\Request;

class PrivilegeController extends Controller
{
    public function getUserPrivileges($userId)
    {
        $privileges = Privilege::where('user_id', $userId)->first();
        return response()->json($privileges);
    }
}
