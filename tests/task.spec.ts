import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
//import { faker } from '@faker-js/faker'

test('deve poder registar uma nova tarefa', async ({ page, request }) => {

    const task: TaskModel= {
        name: 'Ler um livro de TypeScript',
        is_done: false
    }
    //Dado que eu tenho uma nova tarefa 
    await request.delete('http://localhost:3333/helper/tasks/'+ task.name)

    //E que estou na página de registo
    await page.goto('http://localhost:3000')

    //Quando faço o registo dessa tarefa 
    const inputTaskName = page.locator('input[class*=InputNewTask]')
    //await inputTaskName.fill(faker.lorem.words())
    await inputTaskName.fill("Ler um livro de TypeScript")
    await inputTaskName.press('Enter')
    //await page.click('xpath=//button[contains(text(), "Create)]')
    await page.click('css=button >> text=Create')

    //Então essa tarefa deve ser mostrada na lista
    const target = page.locator(`css=.task-item p >> text=${task.name}`)
    await expect(target).toBeVisible()
})
test.only('não deve permitir uma tarefa duplicada', async ({page, request })=>
{
    const task:TaskModel = {
        name: 'Comprar Ketchup',
        is_done: false
    }

    await request.delete('http://localhost:3333/helper/tasks/'+ task.name)
    const newTask = await request.post('http://localhost:3333/tasks/',{data: task})
    expect(newTask.ok()).toBeTruthy()
    await page.goto('http://localhost:3000')
    const inputTaskName = page.locator('input[class*=InputNewTask]')

    await inputTaskName.fill(task.name)
    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})


