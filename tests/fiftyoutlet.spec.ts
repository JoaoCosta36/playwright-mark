import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Função para aceitar cookies
async function aceitarCookies(page) {
    const cookies = page.locator("xpath=//button[@id='onetrust-accept-btn-handler']");
    await cookies.click();
}
// Clicar no botão de Pesquisa da pagina inicial
async function clickSearchButton(page) {
    const cookies = page.locator("xpath=//a[@data-action='show-search']/div[@class='icon-wrapper']");
    await cookies.click();
}
// Função para pesquisar um produto
async function pesquisarProduto(page, produto) {
    const search_bar = page.locator("xpath=//form[@class='search']//input[@id='search']");
    await search_bar.fill(produto);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
}

// Função para adicionar o PS5 ao carrinho
async function adicionarPoloRugby(page) {
    const img_ps5 = page.locator("xpath=//ul[@class='listing-content__list listing-content__list--grid']//img[@src='https://www.worten.pt/i/cf1323a6b426b9b439b63370e3e243609312e5cd']");
    await img_ps5.click();
    
    const cart_btn = page.locator("xpath=//button[@class='add-to-cart__button--buy-box add-to-cart__button button--primary button--lg button--red button--icon-left button add-to-cart__button--buy-box add-to-cart__button']");
    await cart_btn.click();
    
    const reject_service_add = page.locator("xpath=//span[text()='Continuar sem serviços']");
    await reject_service_add.click();
    
    const goto_cart = page.locator("xpath=//button[@class='cross-sell-products__cart-btn button--secondary button--md button--red button--icon-left button cross-sell-products__cart-btn']");
    await goto_cart.click();
}

test.describe('Ecommerce', () => {
    
    test('Pesquisar por PS5 no site da Worten', async ({ page }) => {
        // Acede ao site da Fifty Outlet
        await page.goto('https://fiftyoutlet.com/pt/pt');
        
        // Aceitar cookies
        await aceitarCookies(page);
        
        // Pesquisar por PS5
        await pesquisarProduto(page, 'PS5');
        
        // Adicionar PS5 ao carrinho
        await adicionarPS5AoCarrinho(page);
        
        // Validar se o produto correto foi adicionado ao carrinho
        const first_product_title = page.locator("xpath=//div[@class='cart__product__wrapper']//div[@class='cart__product__info']/a");
        await expect(first_product_title).toHaveText("Consola PS5 Slim (1 TB)");
        
        await page.waitForTimeout(5000);
    });
    
    test('Validar outro cenário de compra', async ({ page }) => {
        // Acede ao site da Worten
        await page.goto('https://www.worten.pt');
        
        // Aceitar cookies
        await aceitarCookies(page);
        
        // Pesquisar por PS5
        await pesquisarProduto(page, 'PS5');
        
        // Adicionar PS5 ao carrinho
        await adicionarPS5AoCarrinho(page);
        
        // Validar se o produto correto foi adicionado ao carrinho
        const first_product_title = page.locator("xpath=//div[@class='cart__product__wrapper']//div[@class='cart__product__info']/a");
        await expect(first_product_title).toHaveText("Consola PS5 Slim (1 TB)");
        
        await page.waitForTimeout(5000);
    });
});
