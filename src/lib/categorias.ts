export const CATEGORIAS: Record<string, string[]> = {
    Speed: ['Completa', 'Quadro', 'Garfo', 'Guidão', 'Pedivela', 'Câmbio', 'Rodas', 'Selim', 'Outro'],
    Mountain: ['Completa', 'Quadro', 'Suspensão', 'Guidão', 'Pedivela', 'Câmbio', 'Rodas', 'Selim', 'Outro'],
    'Gravel / Ciclocross': ['Completa', 'Quadro', 'Garfo', 'Guidão', 'Pedivela', 'Câmbio', 'Rodas', 'Selim', 'Outro'],
    Triathlon: ['Completa', 'Quadro', 'Aerobar', 'Pedivela', 'Rodas', 'Outro'],
    Urbana: ['Completa', 'Quadro', 'Acessório', 'Bagageiro', 'Outro'],
    Infantil: ['Completa', 'Quadro', 'Outro'],
    Elétrica: ['Completa', 'Quadro', 'Bateria', 'Motor', 'Outro'],
    Acessórios: ['Capacete', 'Roupa', 'Calçado', 'Nutrição', 'Ferramentas', 'Iluminação', 'GPS / Computador', 'Rodas / Pneus', 'Outro'],
  }
  
  export const ESTADOS = [
    'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
    'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
  ]
  
  export function formatarPreco(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  
  export function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR')
  }