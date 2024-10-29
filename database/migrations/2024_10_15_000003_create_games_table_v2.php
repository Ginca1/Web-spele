<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesTableV2 extends Migration
{
    public function up()
    {
        Schema::create('game', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamp('complete_time');
            $table->integer('wins');
            $table->integer('loses');
        });
    }

    public function down()
    {
        Schema::dropIfExists('game');
    }
}

