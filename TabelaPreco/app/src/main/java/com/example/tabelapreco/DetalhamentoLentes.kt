package com.example.tabelapreco

import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import java.text.NumberFormat
import java.util.*

class DetalhamentoLentes : DialogFragment() {

    private lateinit var lente: Lente
    private lateinit var contextAdapter: Context

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.detalhamento_lentes, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val txtDescricao = view.findViewById<TextView>(R.id.descricao)
        val txtPreco = view.findViewById<TextView>(R.id.txt_preco)
        val txtEsferico = view.findViewById<TextView>(R.id.txt_esferico)
        val txtCilindrico = view.findViewById<TextView>(R.id.txt_cilindrico)
        val txtDiametro = view.findViewById<TextView>(R.id.txt_diametro)
        val txtEmpresa = view.findViewById<TextView>(R.id.txt_empresa)
        val txtIndice = view.findViewById<TextView>(R.id.txt_indice)

        txtDescricao.text = lente.descricao
        txtPreco.text = NumberFormat.getCurrencyInstance( Locale("pt", "BR") ).format(lente.venda)
        txtEsferico.text = lente.esferico
        txtCilindrico.text = lente.cilindrico
        txtDiametro.text = lente.diametro.toString()
        txtEmpresa.text = lente.empresa
        txtIndice.text = lente.indice.toString()

        if(lente.promocao) {
            txtPreco.setTextColor(Color.RED)
        }
    }

    companion object{
        fun getInstance() = DetalhamentoLentes()

        fun show(lente: Lente, context: Context, fragmentManager: FragmentManager) {
            with(getInstance()) {
                if(!isAdded) {
                    isCancelable = true

                    this.contextAdapter = context
                    this.lente = lente

                    show(fragmentManager, "")
                }
            }
        }
    }
}