<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('history', function (Blueprint $table) {
            $table->bigIncrements('id'); // Make sure this is a big increment
            $table->unsignedBigInteger('user_id'); // Make sure this is unsigned big integer
            $table->unsignedBigInteger('game_id'); // Make sure this is unsigned big integer
            $table->unsignedBigInteger('enemy_id'); // Make sure this is unsigned big integer
            
            // Set up foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('game_id')->references('id')->on('game')->onDelete('cascade');
            $table->foreign('enemy_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('history');
    }
}
