package com.example.tabelapreco

import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase

class TabelaRepository {
    private val database = Firebase.database;
    val myRef = database.reference;

    fun obterTabela(): Any? {
        myRef.child("lentes").get().addOnSuccessListener {
            return@addOnSuccessListener it.value as Unit
        }.addOnFailureListener {

        }

        return null
    }
}