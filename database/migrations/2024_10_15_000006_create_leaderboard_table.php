<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeaderboardTable extends Migration
{
    public function up()
    {
        Schema::create('leaderboard', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('game_id'); // Assuming this is correct
            $table->unsignedBigInteger('user_id'); // Assuming this is correct
            $table->unsignedBigInteger('rank_id'); // Ensure this matches the levels table's id
            $table->timestamps();

            // Adding foreign key constraints
            $table->foreign('game_id')->references('id')->on('game')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('rank_id')->references('id')->on('level')->onDelete('cascade'); // Reference to levels table
        });
    }

    public function down()
    {
        Schema::dropIfExists('leaderboard');
    }
}
