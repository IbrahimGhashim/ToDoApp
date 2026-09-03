import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Toast from "../components/Toast";

function Home() {
  const navigate = useNavigate();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // ============================
  // TOAST MESAJI
  // ============================
  function showMessage(text, type = "error") {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  // ============================
  // GÖREVLERİ GETİR
  // GET /api/tasks
  // ============================
  async function getTasks() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message);
        return;
      }

      const formattedTasks = data.tasks.map((task) => ({
        id: task.Id,
        title: task.Title,
        completed: task.Completed,
      }));

      setTasks(formattedTasks);

    } catch (error) {
      console.error("Görevleri getirme hatası:", error);

      showMessage(
        "Görevler alınamadı. Sunucu çalışıyor mu?"
      );
    }
  }

  // Home açıldığında görevleri getir
  useEffect(() => {
    getTasks();
  }, []);

  // ============================
  // GÖREV EKLE
  // POST /api/tasks
  // ============================
  async function handleAddTask() {
    if (task.trim() === "") {
      showMessage("Görev boş bırakılamaz.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: task,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message);
        return;
      }

      // Backend'den dönen gerçek görevi listeye ekle
      const newTask = {
        id: data.task.Id,
        title: data.task.Title,
        completed: data.task.Completed,
      };

      setTasks((prevTasks) => [
        newTask,
        ...prevTasks,
      ]);

      setTask("");

      showMessage(
        "Görev başarıyla eklendi.",
        "success"
      );

    } catch (error) {
      console.error("Görev ekleme hatası:", error);

      showMessage(
        "Görev eklenemedi. Sunucu çalışıyor mu?"
      );
    }
  }

  // ============================
  // GÖREV TAMAMLA / GERİ AL
  // PUT /api/tasks/:id
  // ============================
  async function handleToggleTask(id) {
    const selectedTask = tasks.find(
      (task) => task.id === id
    );

    if (!selectedTask) {
      return;
    }

    const newCompleted =
      !selectedTask.completed;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: selectedTask.title,
            completed: newCompleted,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message);
        return;
      }

      // Backend'den gelen güncel görevi kullan
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                id: data.task.Id,
                title: data.task.Title,
                completed: data.task.Completed,
              }
            : task
        )
      );

    } catch (error) {
      console.error(
        "Görev durumunu değiştirme hatası:",
        error
      );

      showMessage(
        "Görev güncellenemedi."
      );
    }
  }

  // ============================
  // GÖREV SİL
  // DELETE /api/tasks/:id
  // ============================
  async function handleDeleteTask(id) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message);
        return;
      }

      // Başarılıysa React listesinden de kaldır
      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) => task.id !== id
        )
      );

      showMessage(
        "Görev başarıyla silindi.",
        "success"
      );

    } catch (error) {
      console.error(
        "Görev silme hatası:",
        error
      );

      showMessage(
        "Görev silinemedi."
      );
    }
  }

  // ============================
  // DÜZENLEME MODUNA GEÇ
  // ============================
  function handleEditTask(task) {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  }

  // ============================
  // GÖREVİ DÜZENLE
  // PUT /api/tasks/:id
  // ============================
  async function handleSaveEdit(id) {
    if (editingText.trim() === "") {
      showMessage("Görev boş bırakılamaz.");
      return;
    }

    const selectedTask = tasks.find(
      (task) => task.id === id
    );

    if (!selectedTask) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: editingText.trim(),
            completed: selectedTask.completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message);
        return;
      }

      // Backend'den gelen güncel görevi listeye koy
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                id: data.task.Id,
                title: data.task.Title,
                completed: data.task.Completed,
              }
            : task
        )
      );

      setEditingTaskId(null);
      setEditingText("");

      showMessage(
        "Görev başarıyla güncellendi.",
        "success"
      );

    } catch (error) {
      console.error(
        "Görev güncelleme hatası:",
        error
      );

      showMessage(
        "Görev güncellenemedi."
      );
    }
  }

  // ============================
  // DÜZENLEMEYİ İPTAL ET
  // ============================
  function handleCancelEdit() {
    setEditingTaskId(null);
    setEditingText("");
  }

  // ============================
  // ÇIKIŞ YAP
  // ============================
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  // ============================
  // İSTATİSTİKLER
  // ============================
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks =
    totalTasks - completedTasks;

  // ============================
  // HTML
  // ============================
  return (
    <div className="home-container">

      <Toast
        message={message}
        type={messageType}
      />

      <div className="home-content">

        {/* HEADER */}
        <header className="home-header">

          <div>
            <h1 className="home-title">
              To Do App
            </h1>

            <p className="home-subtitle">
              Görevlerini düzenle ve verimli çalış.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Çıkış Yap
          </button>

        </header>


        {/* İSTATİSTİKLER */}
        <div className="stats-container">

          <div className="stat-card">

            <span className="stat-title">
              Toplam Görev
            </span>

            <strong className="stat-number">
              {totalTasks}
            </strong>

          </div>


          <div className="stat-card">

            <span className="stat-title">
              Tamamlanan
            </span>

            <strong className="stat-number completed-number">
              {completedTasks}
            </strong>

          </div>


          <div className="stat-card">

            <span className="stat-title">
              Kalan
            </span>

            <strong className="stat-number">
              {remainingTasks}
            </strong>

          </div>

        </div>


        {/* GÖREV EKLE */}
        <div className="add-task-container">

          <input
            className="task-input"
            type="text"
            placeholder="Yeni görev yaz..."
            value={task}
            onChange={(e) =>
              setTask(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />

          <button
            className="add-button"
            onClick={handleAddTask}
          >
            Ekle
          </button>

        </div>


        {/* GÖREVLER */}
        <div className="tasks-section">

          <div className="tasks-header">

            <h2 className="tasks-title">
              Görevlerim
            </h2>

            <span className="task-count">
              {totalTasks} görev
            </span>

          </div>


          {tasks.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                Henüz görev yok
              </h3>

              <p>
                Yukarıdaki alandan ilk görevini ekle.
              </p>

            </div>

          ) : (

            <div className="task-list">

              {tasks.map((task) => (

                <div
                  className={`task-card ${
                    task.completed
                      ? "task-completed"
                      : ""
                  }`}
                  key={task.id}
                >

                  {editingTaskId === task.id ? (

                    <div className="edit-container">

                      <input
                        className="edit-input"
                        type="text"
                        value={editingText}
                        onChange={(e) =>
                          setEditingText(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(task.id);
                          }
                        }}
                        autoFocus
                      />

                      <button
                        className="save-button"
                        onClick={() =>
                          handleSaveEdit(task.id)
                        }
                      >
                        Kaydet
                      </button>

                      <button
                        className="cancel-button"
                        onClick={handleCancelEdit}
                      >
                        İptal
                      </button>

                    </div>

                  ) : (

                    <>
                      <input
                        className="task-checkbox"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleToggleTask(task.id)
                        }
                      />

                      <span className="task-title">
                        {task.title}
                      </span>

                      <div className="task-actions">

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEditTask(task)
                          }
                        >
                          Düzenle
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteTask(task.id)
                          }
                        >
                          Sil
                        </button>

                      </div>
                    </>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Home;