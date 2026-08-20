import "./styles.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import Button from "./Button";
import Card from "./Card";
import Modal from "./Modal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <h1>remote 단독 실행 화면</h1>

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Card
          imageUrl="https://placehold.co/240x240"
          name="기본 반팔 티셔츠"
          price={15000}
          onAddToCart={() => alert("담기 클릭됨")}
        />
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="샘플 모달">
        <p>Tailwind 스타일 확인용</p>
      </Modal>
    </div>
  );
}

const container = document.getElementById("root");
createRoot(container).render(<App />);
