

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserPicturesTable extends Migration
{
    public function up()
    {
        Schema::create('user_pictures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('picture_id');
            $table->boolean('owned')->default(false);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('picture_id')->references('id')->on('picture')->onDelete('cascade');

            // Unique constraint to ensure a user can only have one entry per picture
            $table->unique(['user_id', 'picture_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_pictures');
    }
}
