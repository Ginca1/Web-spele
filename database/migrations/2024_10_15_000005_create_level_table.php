<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLevelTable extends Migration
{
    public function up()
    {
        Schema::create('level', function (Blueprint $table) {
            $table->bigIncrements('id'); 
            $table->integer('rank'); 
            $table->integer('score'); 
          
        });
    }

    public function down()
    {
        Schema::dropIfExists('level');
    }
}
