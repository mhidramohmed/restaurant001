<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
   // List all reservations
    public function index()
    {
        return response()->json([
            'data' => Reservation::all()
        ]);
    }

    // Store a new reservation
    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'nullable|email',
            'phone'  => 'nullable|string|max:20',
            'date'   => 'required|date',
            'time'   => 'nullable',
            'guests' => 'required|integer|min:1',
            'status' => 'in:pending,confirmed,cancelled',
            'notes'  => 'nullable|string',
        ]);

        $reservation = Reservation::create($request->all());

        return response()->json([
            'message' => 'Reservation created successfully!',
            'data'    => $reservation
        ], 201);
    }

    // Show a single reservation
    public function show($id)
    {
        $reservation = Reservation::findOrFail($id);
        return response()->json($reservation);
    }

    // Update reservation
    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $request->validate([
            'status' => 'in:pending,confirmed,cancelled',
        ]);

        $reservation->update($request->all());

        return response()->json([
            'message' => 'Reservation updated successfully!',
            'data'    => $reservation
        ]);
    }

    // Delete reservation
    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();

        return response()->json([
            'message' => 'Reservation deleted successfully.'
        ]);
    }

}
