import "./styles.css";
import { useEffect, useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  /*Cria um useState com um array de strings vazio*/
  const [tasks, setTasks] = useState<string[]>([]);
  const [edit, setEdit] = useState({
    enabled: false /*Indica se está em modo de edição*/,
    task: "" /*Tarefa clicada para editar; começa vazia*/,
  });

  /*É um ciclo de vida. Quando o componente carregar, ele busca as tarefas salvas no navegador e atualiza o estado com elas.*/
  useEffect(() => {
    /*Acessa o localStorage do navegador e busca os dados salvos com a chave "@cursoReact"*/
    const tarefasSalvas = localStorage.getItem("@cursoReact");
    /*Verifica se encontrou algum valor*/
    if (tarefasSalvas) {
      /*Converte a string JSON de volta para um array de tarefas com JSON.parse, e atualiza tasks*/
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, []);

  function handleRegister() {
    /*Condição caso não tenha nenhuma tarefa no input, o "!" representa negação*/
    if (!input) {
      alert("Adicione uma tarefa!");
      return;
    }
    /*Indica se o modo de edição está ativo*/
    if (edit.enabled) {
      handleSaveEdit();
      return;
    }
    /*setTasks → função usada para atualizar o useState tasks.
    (tarefas) => [...tarefas, input] → função que recebe o valor atual do estado (tarefas) e retorna um novo array. REVISAR
    [...tarefas, input] → usa o spread operator para copiar os elementos do array atual e adiciona o novo item (input) ao final. */
    setTasks((tarefas) => [...tarefas, input]);
    setInput(""); /*usado para limpar o campo de input*/
    /*Salva as tasks no localStorage*/
    localStorage.setItem("@cursoReact", JSON.stringify([...tasks, input]));
  }

  function handleSaveEdit() {
    /*metodo para encontrar o indice da task no array de tasks 
    task representa o item atual que está sendo analisado naquele momento
    (task) => task === edit.task: condição usada para encontrar a tarefa igual à que está sendo editada*/
    const findIndexTask = tasks.findIndex((task) => task === edit.task);
    /*Cria uma cópia nova do array tasks para que você possa modificá-la sem afetar o original  */
    const allTasks = [...tasks];
    /*Altera a tarefa que está sendo editada, trocando-a pelo valor digitado no campo input*/
    allTasks[findIndexTask] = input;
    /*Atualiza o useState tasks com o array editado (allTasks).*/
    setTasks(allTasks);
    setEdit({
      enabled: false /*Desativa o modo de edição*/,
      task: "" /* Limpa a tarefa que estava sendo editada*/,
    });
    setInput(""); /*Limpa o campo de entrada (input)*/
    localStorage.setItem("@cursoReact", JSON.stringify(allTasks));
  }

  /* (item: string) indica que a função recebe um item do tipo string como parâmetro. É necessário declarar o tipo para garantir a tipagem correta.
  Esse item representa o valor de uma tarefa que queremos remover da lista tasks*/
  function handleDelete(item: string) {
    /*.filter() cria um novo array de tasks contendo apenas os itens que não são iguais a item
    task representa o item atual que está sendo analisado naquele momento*/
    const removeTask = tasks.filter((task) => task !== item);
    setTasks(removeTask); /*passar o valor de removeTask para tasks*/
    localStorage.setItem("@cursoReact", JSON.stringify(removeTask));
  }

  function handleEdit(item: string) {
    setInput(item); /*Preenche o imput com o item*/
    setEdit({
      enabled: true /*Indica se está em modo de edição*/,
      task: item /*Tarefa clicada para editar*/,
    });
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <input
        placeholder="Digite o nome da tarefa..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleRegister}>
        {/*condicional ternaria*/}
        {edit.enabled ? "Atualizar Tarefa" : "Adicionar Tarefa"}{" "}
      </button>
      <hr />
      {/*Usar o método map para percorrer os itens do array.
      item: representa o elemento atual do array
      index: representa a posição (índice) do item no array*/}
      {tasks.map((item, index) => (
        /*Ao usar o método map, sempre forneça a prop key com um valor único. 
        Neste caso, cada item será único e pode ser usado como key.*/
        <section key={item}>
          <span>{item}</span>
          {/*Usamos uma função anônima no onClick (() => handleEdit(item)) porque queremos passar um argumento para handleDelete.
          Se usarmos onClick={handleEdit(item)}, a função será executada imediatamente, não no clique.
          A função anônima garante que só será executada quando o botão for clicado. */}
          <button onClick={() => handleEdit(item)}>Editar</button>
          <button onClick={() => handleDelete(item)}>Excluir</button>
        </section>
      ))}
    </div>
  );
}
