const API_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// Converter os dados recebidos da TMDB
function formatarFilmes(filmes) {
    return filmes.map(filme => ({
        id: filme.id,
        titulo: filme.title,
        ano: filme.release_date
            ? Number(filme.release_date.substring(0, 4))
            : null,
        classificacao: filme.vote_average,
        imagem: filme.poster_path
            ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
            : 'https://placehold.co/200x300?text=Sem+Imagem',
        generos: filme.genre_ids
    }))
}

// Organizar os resultados e a paginação
function formatarResposta(dados) {
    return {
        filmes: formatarFilmes(dados.results),
        paginaActual: dados.page,
        totalPaginas: Math.min(dados.total_pages, 500),
        totalResultados: dados.total_results
    }
}

// Obter filmes populares
export async function obterFilmesPopulares(pagina = 1) {

    const resposta = await fetch(
        `${API_URL}/movie/popular?api_key=${API_KEY}&language=pt-PT&page=${pagina}`
    )

    if (!resposta.ok) {
        throw new Error('Erro ao obter filmes da TMDB')
    }

    const dados = await resposta.json()

    return formatarResposta(dados)
}

// Pesquisar filmes pelo título
export async function pesquisarFilmes(titulo, pagina = 1) {

    if (!titulo.trim()) {
        return obterFilmesPopulares(pagina)
    }

    const parametros = new URLSearchParams({
        api_key: API_KEY,
        language: 'pt-PT',
        query: titulo,
        page: String(pagina)
    })

    const resposta = await fetch(
        `${API_URL}/search/movie?${parametros}`
    )

    if (!resposta.ok) {
        throw new Error('Erro ao pesquisar filmes')
    }

    const dados = await resposta.json()

    return formatarResposta(dados)
}

// Descobrir filmes utilizando filtros
export async function descobrirFilmes(
    genero,
    ano,
    classificacao,
    pagina = 1
) {

    const parametros = new URLSearchParams({
        api_key: API_KEY,
        language: 'pt-PT',
        sort_by: 'popularity.desc',
        page: String(pagina)
    })

    if (genero) {
        parametros.append('with_genres', genero)
    }

    if (ano) {
        parametros.append('primary_release_year', ano)
    }

    if (classificacao) {
        parametros.append('vote_average.gte', classificacao)
    }

    const resposta = await fetch(
        `${API_URL}/discover/movie?${parametros}`
    )

    if (!resposta.ok) {
        throw new Error('Erro ao descobrir filmes')
    }

    const dados = await resposta.json()

    return formatarResposta(dados)
}

// Pesquisar por título e aplicar filtros em todos os resultados
export async function pesquisarFilmesComFiltros(
    titulo,
    genero,
    ano,
    classificacao,
    pagina = 1
) {

    const primeiraResposta = await pesquisarFilmes(titulo, 1)

    let todosFilmes = [...primeiraResposta.filmes]

    // A TMDB permite consultar até 500 páginas.
    const totalPaginasPesquisa = primeiraResposta.totalPaginas

    // Consultar as restantes páginas da pesquisa
    for (let numero = 2; numero <= totalPaginasPesquisa; numero++) {

        const resposta = await pesquisarFilmes(titulo, numero)

        todosFilmes.push(...resposta.filmes)
    }

    // Aplicar todos os filtros
    const filmesFiltrados = todosFilmes.filter(filme => {

        const correspondeGenero =
            !genero ||
            filme.generos.includes(Number(genero))

        const correspondeAno =
            !ano ||
            filme.ano === Number(ano)

        const correspondeClassificacao =
            !classificacao ||
            filme.classificacao >= Number(classificacao)

        return correspondeGenero &&
            correspondeAno &&
            correspondeClassificacao
    })

    // Organizar os resultados em páginas de 20 filmes
    const filmesPorPagina = 20

    const totalResultados = filmesFiltrados.length

    const totalPaginas = Math.ceil(
        totalResultados / filmesPorPagina
    )

    const inicio = (pagina - 1) * filmesPorPagina

    const fim = inicio + filmesPorPagina

    return {
        filmes: filmesFiltrados.slice(inicio, fim),
        paginaActual: pagina,
        totalPaginas,
        totalResultados
    }
}
// Obter os detalhes de um filme
export async function obterDetalhesFilme(id) {

    const resposta = await fetch(
        `${API_URL}/movie/${id}?api_key=${API_KEY}&language=pt-PT`
    )

    if (!resposta.ok) {
        throw new Error('Erro ao obter detalhes do filme')
    }

    return await resposta.json()
}

// Obter os vídeos de um filme
export async function obterVideosFilme(id) {

    const resposta = await fetch(
        `${API_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    )

    if (!resposta.ok) {
        throw new Error('Erro ao obter vídeos do filme')
    }

    const dados = await resposta.json()

    return dados.results
}