import RouterEngine from "./components/RouterEngine";
import { useModalStore } from "@/stores/modalStore";
import { TodoModal } from "@/features/board/components/Todo";

function App() {
  const todo = useModalStore((s) => s.todo);
  const isOpen = useModalStore((s) => s.isOpen);
  return (
    <>
      <RouterEngine/>
      {isOpen && todo && <TodoModal key={todo.id} />}
    </>
    
  )
}

export default App
