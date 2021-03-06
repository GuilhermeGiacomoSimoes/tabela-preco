package com.example.tabelapreco

import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.WindowManager
import android.widget.EditText
import android.widget.ListView
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.core.widget.addTextChangedListener
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import java.util.*

class MainActivity : AppCompatActivity() {

    private val firebase = FirebaseDatabase.getInstance().reference
    private var listaLente = ArrayList<Lente>()

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val window = this.window
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
        window.statusBarColor = ContextCompat.getColor(this, R.color.main)

        val edtPesquisa = findViewById<EditText>(R.id.edt_pesquisa)

        edtPesquisa.addTextChangedListener( object  : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {

            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {

            }

            override fun afterTextChanged(s: Editable?) {
                val listaFiltrada = listaLente.filter {
                    it.descricao.contains(s.toString().toUpperCase())
                }

                val l = ArrayList<Lente>()
                l.addAll(listaFiltrada)
                organizarLista(l)
            }
        })

        obterTodasLentes()
    }

    private fun organizarLista(list: ArrayList<Lente>) {
        val tabela = findViewById<ListView>(R.id.tabela)
        tabela.adapter = LentesAdapter(list, this)
    }

    private fun obterTodasLentes() {
        val list = ArrayList<Lente>()

        try {
            firebase.child("lentes").addValueEventListener(object: ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    list.clear()

                    for (data in snapshot.children) {
                        for(lente in data.children) {
                            val l = lente.getValue(Lente ::class.java)
                            if(l != null){
                                list.add(l)
                            }
                        }
                    }

                    organizarLista(list)
                    listaLente = list
                }
                override fun onCancelled(error: DatabaseError) {
                    TODO("Not yet implemented")
                }

            })
        }catch (e: Exception) {

        }
    }
}