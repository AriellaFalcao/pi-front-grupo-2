import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Cliente } from 'src/app/models/Cliente';
import { Itens } from 'src/app/models/Itens';
import { Pedido } from 'src/app/models/Pedido';
import { Produto } from 'src/app/models/Produto';
import { ClienteService } from 'src/app/services/cliente.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @Input() cliente!:Cliente;

  // Controlando o subtotal da compra
  subTotalCompra:number;
  // Calculando o frete
  frete:number;
  // Data de entrega agendada
  agendamento!:Date;
  // Criando o array de Produtos
  carrinho!:Produto[];
  // Email para consultar Cliente
  email:string="brunosabia@gmail.com";

  // constructor(private clienteService:ClienteService) {
  //Injetando construtor do formulário e o serviço para Pedido
  constructor(private formBuilder:FormBuilder,private pedidoService:PedidoService) {
    // Incializar subTotalCompra
    this.subTotalCompra=0;
    // Inicializar frete
    this.frete=40;
   }

  ngOnInit(): void {
    this.CarregarCarinho();
    this.CarregarAgendamento();
  }

  CarregarCarinho(): void {
    // Verificando se Carrinho existe no LocalStorage
    if(localStorage.getItem("carrinho")) {
      // Adicionar produtos do carrinho no array de produtos (atributo "carrinho")
      this.carrinho = JSON.parse(localStorage.getItem("carrinho"));
      // Atualizar total da compra
      this.AtualizarTotalCompra();
    } else {
      // Carrinho não existe no LocalStorage. Inicializar array.
      this.carrinho = [];
    }
  }

  AtualizarTotalCompra(): void {
    // Reinicializar totalCompra
    this.subTotalCompra=0; //120 //200
    this.carrinho.forEach(produto => {
      // Atualizando o valor da compra
      this.subTotalCompra=this.subTotalCompra+(produto.quantidade*produto.preco);  
    });
  }

  CarregarAgendamento(): void {
    // Verificando se Agendamento existe no LocalStorage
    if(localStorage.getItem("entrega")) {
      // Adicionar produtos do carrinho no array de produtos (atributo "carrinho")
      if(localStorage.getItem("entrega")=="undefined") {
        const DATAATUAL = new Date();
        this.agendamento = new Date(DATAATUAL.getFullYear(),DATAATUAL.getMonth(),DATAATUAL.getDay()+3);
        // Armazenando agendamento de entrega no Local Storage
        localStorage.setItem("entrega", JSON.stringify(this.agendamento));
      } else {
        this.agendamento = JSON.parse(localStorage.getItem("entrega"));
      }
    } else {
      // Agendamento não existe no LocalStorage. 
      // Inicializar com regra de negócio: Data Atual + 3 dias corridos
      // Recuperando o ano atual
      const DATAATUAL = new Date();
      // Data mínima para pedido: 3 dias corridos da data atual
      this.agendamento = new Date(DATAATUAL.getFullYear(),DATAATUAL.getMonth(),DATAATUAL.getDay()+3);
      // Armazenando agendamento de entrega no Local Storage
      localStorage.setItem("entrega", JSON.stringify(this.agendamento));
    }    
  }

  FecharPedido(): void {
}}
