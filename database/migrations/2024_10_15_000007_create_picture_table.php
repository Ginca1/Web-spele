<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePictureTable extends Migration
{
    public function up()
    {
        Schema::create('picture', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
        });
    }

    public function down()
    {
        Schema::dropIfExists('picture');
    }
}
