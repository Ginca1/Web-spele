<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'toms',
        'email' => 'toms@gmail.com',
        'password' => 'Toms1234!',
        'password_confirmation' => 'Toms1234!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));
});
