import express, { json } from 'express'
import tasks from './tasks.json'  with {type: "json"}

const app = express();
app.use(json());

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.get('/tareas', (req, res) => {

    const accesos_permitidos = [
        'http:/localhost:4000',
    ]

    const origen = req.get('origin')
    if (accesos_permitidos.includes(origen)) {
        res.header('Access-Control-Allow-Origin', origen)
    }

    res.header('Access-Control-Allow-Origin', '*')

    res
        .header('Content-Type', 'application/json')
        .status(200)
        .json(tasks)
});

app.get('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find((task) => task.id == id);
    if (!task) {
        res.status(404).json({ message: 'Tarea no encontrada' });
    } else {
        res.json(task);
    }
});

app.post('/tareas', (req, res) => {
    const { titulo, descripcion } = req.body;
    if (!titulo || titulo.trim() === "") {
        return res.status(400).json({ error: "El título es obligatorio." });
    }
    if (!descripcion || descripcion.length < 20) {
        return res.status(400).json({ error: "La descripción debe tener al menos 20 caracteres." });
    }
    const newTask = {
        id: tasks.length + 1,
        titulo,
        descripcion,
        completada: false,
        fecha_creacion: new Date().toISOString()
    }
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex((task) => task.id == id);
    if (index === -1) {
        res.status(404).json({ message: 'Tarea no encontrada' });
    } else {
        const { titulo, descripcion } = req.body;
        if (!titulo || titulo.trim() === "") {
            return res.status(400).json({ error: "El título es obligatorio." });
        }
        if (!descripcion || descripcion.length < 20) {
            return res.status(400).json({ error: "La descripción debe tener al menos 20 caracteres." });
        }
        tasks[index] = req.body;
        res.json(tasks[index]);
    }
});

app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex((task) => task.id == id);
    if (index === -1) {
        res.status(404).json({ message: 'Tarea no encontrada' });
    } else {
        tasks.splice(index, 1);
        res.sendStatus(204);
    }
});

app.use((req, res) => {
    req.status(404).json({
        message: "URL no encontrada"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})