const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  let { title, url, techs } = request.body;

  let repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  let { id } = request.params;
  let { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Its not valid UUID" });
  }

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  let { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Its not valid UUID" });
  }

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response
    .status(200)
    .json({ messagem: "Repository deleted with success" });
});

app.post("/repositories/:id/like", (request, response) => {
  let { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Its not valid UUID" });
  }

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
