import { test, expect, APIRequestContext } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'
//import { faker } from '@faker-js/faker'

let tasksPage: TasksPage
test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
}

)
test.describe('registo', () => {
    test('deve poder registar uma nova tarefa', async ({request }) => {

        const task = data.success as TaskModel
        await deleteTaskByHelper(request, task.name)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)

    })
    test('não deve permitir uma tarefa duplicada', async ({request }) => {
        const task = data.duplicate as TaskModel


        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async () => {
        const task = data.required as TaskModel


        await tasksPage.go()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', () => {
    test('deve concluir uma tarefa', async ({ page, request }) => {
        const task = data.update as TaskModel
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    test('deve excluir uma tarefa', async ({request }) => {
        const task = data.delete as TaskModel
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
        await tasksPage.go()
        await tasksPage.removeTask(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})