package com.example.tabelapreco

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import java.util.ArrayList

class MainActivity : AppCompatActivity() {

    private val firebase = FirebaseDatabase.getInstance().reference
    private val listaLente = ArrayList<Lente>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        obterTodasLentes()
    }

    private fun organizarLista(list: ArrayList<Empresa>) {
        for(empresa in list){
            listaLente.addAll(empresa.lentes)
        }

        val tabela = findViewById<ListView>(R.id.tabela)

        tabela.adapter = LentesAdapter(listaLente, this)
    }

    private fun obterTodasLentes() {
        val list = ArrayList<Empresa>()

        try {
            firebase.child("lentes").addValueEventListener(object: ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    for (data in snapshot.children) {
                        if(data.getValue(Empresa ::class.java) != null) {
                            val empresa = data.getValue(Empresa ::class.java)
                            list.add(empresa !!)
                        }
                    }

                    organizarLista(list)
                }
                override fun onCancelled(error: DatabaseError) {
                    TODO("Not yet implemented")
                }

            })
        }catch (e: Exception) {

        }
    }

    private class Empresa {
        var lentes = ArrayList<Lente>()
    }
}