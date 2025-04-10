<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name'); // Name of the person reserving
            $table->string('phone')->nullable();
            $table->date('date'); // Reservation date
            $table->time('time')->nullable(); // Reservation time
            $table->integer('guests')->default(1); // Number of people
            $table->text('notes')->nullable(); // Optional message or requests
            $table->timestamps();
            $table->softDeletes(); // Soft delete column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
