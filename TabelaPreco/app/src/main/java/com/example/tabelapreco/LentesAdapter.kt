package com.example.tabelapreco

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.text.NumberFormat
import java.util.*

class LentesAdapter(private val list: ArrayList<Lente>, private val context: Context): BaseAdapter() {
    override fun getCount() = list.size

    override fun getItem(position: Int) = list[position]

    override fun getItemId(position: Int): Long {
        return 0
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val layout = if( convertView == null ) {
            val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            inflater.inflate(R.layout.lentes_adapter, null)
        } else {
            convertView
        }

        if(position % 2 == 0) {
            layout.setBackgroundResource(R.color.pairs)
        }
        else{
            layout.setBackgroundResource(R.color.odd)
        }

        val descricao = layout.findViewById<TextView>(R.id.descricao)
        val preco = layout.findViewById<TextView>(R.id.preco)

        descricao.text = list[position].descricao
        preco.text = NumberFormat.getCurrencyInstance( Locale("pt", "BR") ).format(list[position].venda)

        if(list[position].promocao){
            preco.setTextColor(Color.RED)
        }

        val item = layout.findViewById<LinearLayout>(R.id.ll_lente_lista)

        item.setOnClickListener {
            DetalhamentoLentes.show(list[position], context, (context as AppCompatActivity).supportFragmentManager)
        }

        return layout
    }

}