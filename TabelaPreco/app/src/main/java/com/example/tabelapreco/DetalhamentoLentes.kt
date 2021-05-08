package com.example.tabelapreco

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager

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