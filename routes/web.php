

<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PrivilegeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ContinentController;
use App\Models\Room;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PictureController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\HintController;
use App\Http\Controllers\SkipController;
use App\Http\Controllers\FlagController;
use App\Http\Controllers\MissionController;
use App\Http\Controllers\LevelController;
//routes 35


Route::post('/level-up', [LevelController::class, 'levelUp'])->middleware('auth');
Route::get('/user-data', [UserController::class, 'getUserData'])->middleware('auth');
Route::post('/claim-mission-reward', [MissionController::class, 'claimReward'])->middleware('auth');

Route::post('/use-flag', [FlagController::class, 'useFlag']);
Route::post('/use-skip', [SkipController::class, 'useSkip']);
Route::post('/use-hint', [HintController::class, 'useHint']);


Route::get('/continent/europe', [ContinentController::class, 'europe'])->name('continent.europe');
Route::get('/continent/americas', [ContinentController::class, 'americas'])->name('continent.americas');
Route::get('/continent/asia', [ContinentController::class, 'asia'])->name('continent.asia');
Route::get('/continent/africa', [ContinentController::class, 'africa'])->name('continent.africa');

Route::get('/lobby/valstis', function () {
    return Inertia::render('Lobby/Valstis'); 
})->name('lobby.valstis');

Route::middleware('auth')->get('/user', [UserController::class, 'getUserData']);



Route::get('/rooms', [RoomController::class, 'getUserRooms'])->name('rooms.get');
Route::get('/rooms', [RoomController::class, 'getRooms']);
Route::middleware(['auth'])->group(function () {
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);
});
Route::get('/rooms/{roomId}/messages', [ChatMessageController::class, 'index']);
Route::post('/rooms/{roomId}/messages', [ChatMessageController::class, 'store']);
Route::get('/rooms/user/{id}', [RoomController::class, 'getUserRooms']);




Route::post('/user/purchase-picture', [UserController::class, 'purchasePicture'])->middleware('auth');
Route::post('/user/update-profile-picture', [UserController::class, 'updateProfilePicture'])->middleware('auth');
Route::get('/user/get-user-picture-id', [UserController::class, 'getUserPictureId'])->middleware('auth');
Route::post('/user/purchase-privilege', [UserController::class, 'purchasePrivilege']);
Route::get('/user/get-user-owned-pictures', [UserController::class, 'getOwnedPictures'])
     ->middleware('auth')
     ->name('user.get-owned-pictures');



Route::get('/lobby/{room_code}', [RoomController::class, 'show'])->name('lobby.show');
Route::post('/lobby', [RoomController::class, 'store'])->name('lobby.store');



Route::get('/lobby', function () {
    return Inertia::render('Lobby'); 
})->name('lobby');

Route::get('/create', function () {
    return Inertia::render('Create'); 
})->name('create');




Route::get('/privileges/{userId}', [PrivilegeController::class, 'getUserPrivileges']);

Route::inertia('/leaderboard', 'Leaderboard');

Route::get('/', function () {
    return redirect(auth()->check() ? '/home' : '/register');
});


Route::get('/home', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');





Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
 
    Route::get('/rooms/{room_code}', function ($room_code) {
        
        $room = Room::where('room_code', $room_code)->first();
        
        if (!$room) {
            return response()->json(['error' => 'Room not found'], 404);
        }
        
       
        return Inertia::render('UserRoom', [
            'room' => $room,
        ]);
    });
});


require __DIR__.'/auth.php';




