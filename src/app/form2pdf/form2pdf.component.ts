import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import { FormControl, Validators } from '@angular/forms';
import { pessoa } from '../models/pessoa.model';
import { MatTableDataSource } from '@angular/material/table';

import {
  addDoc,
  getDoc,
  doc,
  Firestore,
  collection
} from '@angular/fire/firestore'
import { getDocs } from '@firebase/firestore';


@Component({
  selector: 'app-form2pdf',
  templateUrl: './form2pdf.component.html',
  styleUrls: ['./form2pdf.component.less']
})
export class Form2pdfComponent implements OnInit {


  // Documentação do jsPDF
  // Default export is a4 paper, portrait, using millimeters for units
  doc = new jsPDF(
    {
      encryption: {
        // senhas para os usuários
        userPassword: "user",
        ownerPassword: "owner",
        // permissões dos usuários 
        userPermissions: ["print", "modify", "copy", "annot-forms"]
        // try changing the user permissions granted
      }
    });





  // Documentação do formulário
  formNome = new FormControl('', [Validators.required]);
  formIdade = new FormControl('', [Validators.required]);
  formAltura = new FormControl('', [Validators.required]);
  formSexo = new FormControl('', [Validators.required]);
  vetorRespostas = [''];

  // data source para a tabela
  displayedColumns: string[] = ["id", "nome", "idade", "altura", "sexo"];
  //Validar form para botão liberar
  isFormFilled = false;

  //Vetor que fomentará a tabela de pacientes. Posteriormente os dados desse vetor serão repassados para o Repositório Firebase.
  pessoas: pessoa[] = [
    (new pessoa("1", "Rogerio", "23", "1,78", "Masculino", [""]))
  ];

  pessoasFirebaseObject : any= {};
  pessoasFirebaseArray = [];
  pessoasFirebase: pessoa[] = [];

  dataSourcePessoas = new MatTableDataSource<pessoa>(this.pessoas);
  dataSourcePessoasFirebase = new MatTableDataSource<pessoa>(this.pessoasFirebase);

  constructor(public firestore: Firestore) {
    this.formValidation();
    this.getData();
  }

  // Função que cria o documento PDF usando a biblioteca jsPDF
  createDoc() {
    //Vetor de String que vai para o PDF
    this.vetorRespostas.push(`Nome: ${this.formNome.value} \n Idade: ${this.formIdade.value} \n Altura: ${this.formAltura.value} \n Sexo: ${this.formSexo.value}`);
    // ifzinho tosco so pra gerar um id qlqr
    let id = 0;
    if (this.pessoas.length == 0) {
      id = 1;
    }
    else {
      id = parseInt(this.pessoas[this.pessoas.length - 1].id) + 1;
    }
    this.registerPersonLocally(`${id}`, this.formNome.value, this.formIdade.value, this.formAltura.value, this.formSexo.value);
    //
    this.doc.text(this.vetorRespostas, 10, 10);
    this.doc.save(`PDF_do_${this.formNome.value}.pdf`);
    // Atualiza a tabela e reseta o formulário
    this.dataSourcePessoas = new MatTableDataSource<pessoa>(this.pessoas);
    this.formReset();
    console.log("Arquivo gerado:", this.doc);
  }
  //

  // Validação do formulário para liberar o botão "salvar como PDF"
  formValidation() {
    if (this.formNome.value != '' && this.formIdade.value != '' && this.formAltura.value != '' && this.formSexo.value != '') {
      this.isFormFilled = true;
    }
    else {
      this.isFormFilled = false;
    }
  }

  // função para resetar formulario
  formReset() {
    this.formNome.reset;
    this.formIdade.reset;
    this.formAltura.reset;
    this.formSexo.reset;
    this.vetorRespostas = [''];
  }
  //

  ngOnInit(): void {
    this.formValidation();
    this.dataSourcePessoas = new MatTableDataSource<pessoa>(this.pessoas);
  }

  /**
   * 
   * Função que pega os dados q estão sendo passado pelo formulário e joga em um vetor local.
   * Atualmente está sendo chamado de Locally pois depois será substituído pelo repositório firebase
   * 
   * @param id id da pessoa cadastrada
   * @param nome nome da pessoa cadastrada
   * @param idade idade da pessoa cadastrada
   * @param altura altura da pessoa cadastrada
   * @param sexo sexo da pessoa cadastrada
   * 
   * @author Henrique Mazzuchetti
   */
  registerPersonLocally(id: string, nome: string, idade: string, altura: string, sexo: string) {
    this.pessoas.push(new pessoa(id, nome, idade, altura, sexo, [""]));
    this.addData();
  }

  /**
   * Chama a função addDoc do Firebase para cadastrar um registro no banco
   */
  addData() {
    const dbInstance = collection(this.firestore, 'pessoas');
    addDoc(dbInstance, { "nome": this.formNome.value, "idade": this.formIdade.value, "altura": this.formAltura.value, "sexo": this.formSexo.value })
      .then(() => {
        alert('Dado enviado');
      })
      .catch((err) => {
        alert(err.message);
      })
  }

  /**
   * Puxa os docs dos arquivos solicitados do firebase q nesse caso é "pessoas".
   */
  async getData() {
    const querySnapshot = await getDocs(collection(this.firestore, "pessoas"));
    this.pessoasFirebaseObject = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
    this.pessoasFirebaseObject.map((pessoas: any) =>{
      this.pessoasFirebase.push(new pessoa(pessoas.id, pessoas.nome, pessoas.idade, pessoas.altura, pessoas.sexo, [""]));
    })
    console.log(this.pessoasFirebase);
    this.dataSourcePessoasFirebase = new MatTableDataSource<pessoa>(this.pessoasFirebase);

  }
  

}
