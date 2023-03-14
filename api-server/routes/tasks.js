/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task operations
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: string
 *         required: true
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: string
 *         required: true
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: string
 *         required: true
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const sql = require('mssql/msnodesqlv8');

const pool = require('../database').pool;

// '/tasks' endpoint
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM TaskTable');
    result.recordset.forEach(task => {
      task.Findings = JSON.parse(task.Findings);
    });

    res.send(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// '/tasks/:id' endpoint
router.get('/:id', async (req, res) => {
  try {
    const result = await pool
      .request()
      .input('input_parameter', req.params.id)
      .query('SELECT * FROM TaskTable WHERE Id = @input_parameter');

    result.recordset.forEach(task => {
      task.Findings = JSON.parse(task.Findings);
    });

    res.send(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// post endpoint
router.post('/', async (req, res) => {
  try {
    const { Status, RepositoryName, Findings } = req.body;

    const result = await pool
      .request()
      .input('id', uuid.v4())
      .input('status', Status)
      .input('repository_name', RepositoryName)
      .input('findings', JSON.stringify(Findings))
      .input('queued_at', new Date())
      .input('scanning_at', null)
      .input('finished_at', null).query(`
        INSERT INTO TaskTable (
          Id,
          Status,
          RepositoryName,
          Findings,
          QueuedAt,
          ScanningAt,
          FinishedAt
        )
        VALUES (
          @id,
          @status,
          @repository_name,
          @findings,
          @queued_at,
          @scanning_at,
          @finished_at
        )
      `);

    res.send(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// delete endpoint
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool
      .request()
      .input('input_parameter', req.params.id)
      .query('DELETE FROM TaskTable WHERE Id = @input_parameter');
    res.send(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// put status endpoint
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).send('id parameter is missing');
    }

    if (!['Queued', 'In Progress', 'Success', 'Failure'].includes(status)) {
      return res.status(400).send('status parameter is invalid');
    }

    //   if sucess or failure, set finished_at
    if (status === 'Success' || status === 'Failure') {
      const result = await pool
        .request()
        .input('id_parameter', id)
        .input('status_parameter', status)
        .input('finished_at', new Date())
        .query(
          'UPDATE TaskTable SET Status = @status_parameter, FinishedAt = @finished_at WHERE Id = @id_parameter'
        );
      return res.send(result.recordset);
    }

    //   if in progress, set scanning_at
    if (status === 'In Progress') {
      const result = await pool
        .request()
        .input('id_parameter', id)
        .input('status_parameter', status)
        .input('scanning_at', new Date())
        .query(
          'UPDATE TaskTable SET Status = @status_parameter, ScanningAt = @scanning_at WHERE Id = @id_parameter'
        );
      return res.send(result.recordset);
    }

    const result = await pool
      .request()
      .input('id_parameter', id)
      .input('status_parameter', status)
      .query(
        'UPDATE TaskTable SET Status = @status_parameter WHERE Id = @id_parameter'
      );

    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
