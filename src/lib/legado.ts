// Matérias do site antigo (Weebly, 2018–2020), migradas para o novo Buff or Die.
// Já importadas em 01/10/2026 (imagens copiadas para o Storage, autor: Rick). Este arquivo
// segue no projeto para os redirecionamentos 301 dos endereços antigos (next.config.ts).
import type { SectionSlug } from "./sections";

export type LegacyPost = {
  path: string; // endereço no site antigo (para o redirecionamento 301)
  slug: string;
  title: string;
  excerpt: string;
  section: SectionSlug;
  score?: number;
  date: string; // data original (aproximada quando o site antigo não informava)
  cover?: string;
  tags: string[];
  content: string;
};

const U = "http://buffordie.com.br/uploads/8/9/5/9/89592829/";
const credit = (who: string, when?: string) =>
  `\n\n— Publicado originalmente no Buff or Die${when ? ` em ${when}` : ""}${who ? `, por ${who}` : ""}.`;

export const legacyPosts: LegacyPost[] = [
  {
    path: "/review-god-of-war.html",
    slug: "review-god-of-war-ps4",
    title: "Review: God of War (PS4) — o melhor da franquia",
    excerpt: "Kratos chega à mitologia nórdica com Atreus, combate de câmera fechada e uma árvore de habilidades enorme. Nota 10.",
    section: "reviews",
    score: 10,
    date: "2018-06-10",
    cover: `${U}god-of-war_orig.jpg`,
    tags: ["God of War", "PS4", "Santa Monica"],
    content: `Quem aí jogou o novo God of War que saiu para o PS4? Nós da Buff or Die jogamos, e adoramos o game. Bora para a review:

O novo God of War mostra o retorno de uma longa saga que se passava na mitologia grega, só que agora está diferente. Estamos na mitologia nórdica. Sim, a mesma mitologia de Thor e Odin. Ninguém estava imaginando que Kratos estaria na mesma mitologia que o Thor, e agora todos nós queremos ver uma luta de Kratos contra Thor — e obviamente Kratos ganharia.

Nesse novo God of War, temos um novo sistema de combate, uma câmera aproximada deixando o combate mais divertido e um pouco mais desafiador. Quando Kratos vai receber algum ataque, aparece uma seta apontando o lugar de onde está vindo o ataque; a seta pode ser amarela, vermelha ou roxa. O sistema hack and slash está um pouco presente nesse novo game: quando você está batendo em algum inimigo, você percebe que ele está ali.

**Atreus não é um estorvo**

Não estamos sozinhos nesse novo game, temos a companhia de Atreus, filho de Kratos, que ajuda muito, assim como a Ellie de The Last of Us. Atreus ajuda Kratos no combate derrubando inimigos, atordoando-os, ou, se o jogador quiser, disparando suas flechas. Atreus pode encontrar pedras de cura e dar para o Kratos caso sua vida esteja muito baixa. Se você tiver uma pedra da ressurreição, ele ressuscita Kratos. As pedras de ressurreição podem ser compradas na loja dos anões, e conforme você prossegue vão sendo liberadas mais pedras.

**Habilidades, armaduras e runas**

God of War tem uma vasta árvore de habilidades: para o machado, para a fúria de Kratos, para as flechas de Atreus e para uma outra arma que você adquire ao longo do jogo — não vamos falar sobre ela para não estragar a surpresa.

Na loja dos anões você pode melhorar armaduras de Kratos, a aljava ou o arco de Atreus. Também dá para confeccionar armaduras para os dois e punhos para o machado de Kratos, cada um com sua vantagem. Armaduras e punhos têm níveis, mostrados pelas cores verde, azul, roxo e amarelo, e aceitam itens encaixados em cada parte.

Ao longo do jogo podemos encontrar ataques rúnicos para o machado, para o arco de Atreus e para a outra arma. Cada ataque rúnico tem sua especialidade, como dar mais dano ou deixar o inimigo atordoado.

**Veredito**

O novo God of War mostra um Kratos mais humanizado, mas ainda brutal como todos os fãs gostam. Ao longo do jogo você percebe a evolução da relação de Kratos e Atreus: no começo, Kratos parece mais um estranho do que um pai, e da metade em diante eles começam a ter uma relação de pai e filho.

Nossa nota para o jogo é **10/10**, considerado **o melhor da franquia**.${credit("@tstatee")}`,
  },
  {
    path: "/red-dead-redemption-review.html",
    slug: "review-red-dead-redemption-2",
    title: "Review: Red Dead Redemption 2 — a imersão levada ao limite",
    excerpt: "Arthur Morgan, um mapa imenso e uma narrativa rica em detalhes: a Rockstar entrega um dos melhores jogos de todos os tempos. Sem spoilers.",
    section: "reviews",
    score: 9,
    date: "2018-11-29",
    cover: `${U}img-review1_1_orig.jpg`,
    tags: ["Red Dead Redemption 2", "Rockstar", "PS4", "Xbox One"],
    content: `**AVISO IMPORTANTE: não contém spoilers.**

Red Dead Redemption foi oficialmente lançado em 2010 com uma alta expectativa, afinal vinha da grandiosa produtora de GTA 4: a Rockstar. Em 2018 fomos, como posso dizer... "abençoados" com mais uma obra-prima produzida por eles: Red Dead Redemption 2.

RDR 2 é incrível, não tem como negar. Até quem não gosta do gênero de jogos em mundo aberto ou faroeste vai reconhecer o trabalho técnico impressionante por trás desse jogo. Temos um mapa imenso, com um cenário belíssimo, tanto no aspecto de direção de arte como na qualidade gráfica, recheado de atividades das mais variadas, tudo interligado por uma excelente narrativa, rica em detalhes e profundidade.

**Foras da lei**

![](${U}fora-da-lei_orig.jpg)

O enredo do game funciona como um prequel do primeiro jogo. Novamente você assume o controle de um fora da lei. Dessa vez é Arthur Morgan, um dos membros mais antigos e fiéis do bando que, após um assalto frustrado em uma cidade do oeste chamada Blackwater, precisa se refugiar no coração dos Estados Unidos junto a seus aliados para fugir das autoridades e se reerguer.

Durante toda a história, vemos o comprometimento de Arthur com o seu grupo. Desde o início, em que o bando precisa agir sempre junto para realizar roubos, resgates e outras atividades, até o desenrolar final, quando o relacionamento já não anda às mil maravilhas. O interessante é que tudo isso se constrói diante das atitudes do próprio protagonista — o que só jogando e se envolvendo com a trama para vivenciar.

O envolvimento do jogador com a história é algo simplesmente esplêndido: você de fato se envolve com toda a trama e sente como se fizesse parte da gangue.

**Um mapa imenso e repleto de atividades**

A cada dia os jogos de mundo aberto ampliam mais as suas regiões. Games como Just Cause 3, Far Cry 5 e Ghost Recon Wildlands trazem milhares de quilômetros virtuais para horas e horas de exploração, mas nenhum deles chega perto do que a Rockstar fez com RDR2.

À medida que o enredo avança, o enorme mapa começa a ser revelado, mesmo que nos primeiros momentos já seja possível percorrê-lo e ter uma noção da grandiosidade. A forma com que ele é explorado faz você perceber a sua amplitude, a começar pelos trajetos: não há carros, lanchas ou aeronaves a 300 km/h, apenas cavalos que, mesmo os mais rápidos, não passam de 50 km/h.

**Gameplay**

A jogabilidade também é muito voltada ao conceito de imersão. Você precisa cuidar dos seus status e da sua evolução: manter-se alimentado e se proteger do calor e do frio para não perder energia. Para isso, é preciso ter sempre alimentos (de preferência não perecíveis) e ficar de olho na temperatura para saber qual roupa usar.

RDR2 conta com mais de 170 espécies de animais, inúmeras armas de todos os tipos (nenhuma absurda como em GTA), carroças, cavalos e roupas — tudo para deixar o clima de velho oeste com um toque pessoal de cada jogador.

**Conclusão**

Red Dead Redemption 2 consegue superar todas as expectativas e chega como um dos melhores jogos de todos os tempos. Com uma proposta ousada e bem executada de criar uma imersão nunca antes vista, o título faz o jogador se sentir dentro do coração dos EUA, com um visual que leva os games a um novo patamar. O jogo mostra que não é preciso óculos de realidade virtual para imergir de uma forma tão única, divertida e natural. Que a Rockstar fique conhecida não mais como "a produtora de GTA", mas como "a empresa responsável por Red Dead Redemption".

**Nota: 9/10**${credit("MaximunPoder", "29 de novembro de 2018")}`,
  },
  {
    path: "/review-resident-evil-2.html",
    slug: "review-resident-evil-2-remake",
    title: "Review: Resident Evil 2 Remake — um dos melhores remakes da história",
    excerpt: "Leon e Claire de volta a Raccoon City com o melhor combate da série e uma delegacia construída de forma excepcional. Nota 10.",
    section: "reviews",
    score: 10,
    date: "2019-02-13",
    cover: `${U}20190203133650-1_orig.jpg`,
    tags: ["Resident Evil 2", "Capcom", "Remake"],
    content: `Após uma longa espera, finalmente fomos recebidos com um já considerado clássico da franquia: Resident Evil 2 Remake. Seu desenvolvimento começou anos atrás com um grupo de programadores que buscava recriar este clássico, melhorando gráficos e jogabilidade sem nenhum suporte. Diante da tremenda dificuldade que era recriar o jogo, a Capcom viu o potencial, financiou o desenvolvimento e assumiu o projeto.

No dia 25 de janeiro de 2019 fomos oficialmente recebidos com esta obra que, além de trazer um sentimento nostálgico a quem jogou a versão de 1998, trouxe novos elementos para os novos jogadores e impressionou quem achava que seria mais do mesmo.

**A dupla**

Leon Kennedy e Claire Redfield são nomes que definem grande parte das melhores aventuras da série Resident Evil. Apesar de não terem super-habilidades, Leon e Claire — em dupla ou individualmente — são praticamente super-heróis da franquia que, pouco a pouco, conquistaram o coração do público por conta das centenas de criaturas derrotadas.

**Estratégias**

O combate é, com folga, o melhor da série: a escassez de munição nas dificuldades mais altas faz cada bala contar. Os inimigos especiais e chefes foram desenhados para serem aterrorizantes, e também não ficam atrás em como reagem às nossas ações — como abrir portas rapidamente e cruzar corredores estreitos.

![](${U}mrx_orig.jpg)

Desviar de zumbis comuns ficou mais fácil, mas só quando estamos lidando com uma criatura. Com dois ou mais inimigos muito próximos, evitar ataques fica mais difícil e o risco de dano duplo — com dois infectados mordendo seu pescoço — é ainda maior. Há inimigos mais poderosos que praticamente não podem ser "enganados", colocando sobre o jogador a responsabilidade da rota que traçou entre um ponto de salvamento e o próximo objetivo.

**Gráficos**

A delegacia de Raccoon City, onde vivemos as intensas primeiras horas de jogo, é construída de forma excepcional — tanto na estética quanto na estrutura de cenários interconectados. As outras áreas do jogo são satisfatoriamente distintas, conectadas e fáceis de entender.

**Veredito**

Com todas as qualidades de um clássico de 1998 refeito da melhor forma possível em 2019, Resident Evil 2 se posiciona no topo de uma série de peso. Os problemas apontados são pequenos demais para ofuscar o talentoso trabalho dos estúdios envolvidos neste que, possivelmente, é um dos melhores remakes da história dos videogames.

**Nota: 10/10**${credit("MaximunPoder", "13 de fevereiro de 2019")}`,
  },
  {
    path: "/review-sekiro-shadows-die-twice.html",
    slug: "review-sekiro-shadows-die-twice",
    title: "Review: Sekiro: Shadows Die Twice — o Lobo de um braço só",
    excerpt: "Enredo, prótese shinobi, furtividade e a mecânica de morte do jogo da FromSoftware que levou o GOTY 2019. Nota 9.",
    section: "reviews",
    score: 9,
    date: "2019-04-15",
    cover: `${U}sekiro-shadows-die-twice-normal-hero-background-01-ps4-us-21jun18_orig.jpg`,
    tags: ["Sekiro", "FromSoftware", "Activision"],
    content: `**Enredo**

Sekiro: Shadows Die Twice conta a história de um shinobi, o "Lobo de um braço só" (Sekiro), também conhecido como Lobo (Okami), um guerreiro desfigurado e caído em desgraça que foi resgatado do abismo da morte.

**Sobre o game**

É um jogo de ação e aventura sobrenatural com elementos de RPG, desenvolvido pela FromSoftware e publicado pela Activision em 2019. É uma experiência single player baseada no período Sengoku do Japão, no fim dos anos 1500 — uma era brutal de conflitos constantes —, em que enfrentamos inimigos épicos em um mundo sombrio e distorcido. Diferente dos jogos anteriores da desenvolvedora, o game conta uma história bem definida de um protagonista.

O protagonista, Sekiro, é um shinobi: um agente secreto do Japão feudal especializado em artes de guerra não ortodoxas, criado desde criança para servir em espionagem, sabotagem, infiltração, assassinato e combate aberto. Ele domina bloqueio, deflexão, ataque e ninjutsus e, com visão e audição aguçadas, é capaz de se esgueirar pelos inimigos e realizar um ataque mortal.

![](${U}juzou-the-drunkard_orig.jpg)

Como protetor do Herdeiro Divino Kuro, o último de uma linhagem lendária, Okami deve proteger o desejo de seu mestre nem que custe a própria vida. Ao tentar resgatar Kuro, ele é derrotado por Genichiro, comandante do clã Ashina, perde o braço esquerdo e vê o Herdeiro ser sequestrado.

O Escultor, um misterioso monge obcecado por esculpir estátuas budistas, resgata Sekiro e o equipa com a Prótese Shinobi. Usando o braço e suas ferramentas, Sekiro parte para o castelo de Ashina para recuperar seu mestre. Ao longo do caminho, descobre os segredos da região, a verdade sobre a linhagem lendária, o sangue do Dragão e a maldição dos imortais — afinal, a imortalidade do Lobo não tem preço barato: quando ele morre, quem está ao redor é atingido pela praga do Dragão.

A história gira em torno de intrigas e esquemas e, dependendo do que o jogador descobre, novas opções de enredo ramificam a narrativa, com uma boa quantidade de plot twists.

**Combate e ferramentas**

Sekiro usa a katana Kusabimaru como arma principal e, depois, a Mortal Blade como arma especial. As ferramentas protéticas do braço esquerdo formam um arsenal amplo e versátil: gancho para navegação vertical, shurikens para atacar à distância, machado para quebrar defesas, guarda-chuva ninja como escudo, bombinhas shinobi para assustar animais e cegar inimigos, e uma lança que rasga armaduras.

![](${U}sekiro-shadows-die-twice-skills_orig.jpg)

A furtividade é essencial: agachar-se reduz o ruído e a visibilidade, e o ambiente ajuda — mas é dinâmico, e se a grama que te esconde for queimada, você fica exposto. Artes de Combate, Artes Marciais Shinobi e Habilidades Latentes são liberadas com Textos Esotéricos e pontos de habilidade; Contas de Oração aumentam Saúde e Postura, e Memórias de chefes aumentam o Poder de Ataque.

**A mecânica da morte**

Morrer custa dinheiro e experiência, o que é angustiante — mas em certo ponto se torna trivial com as bolsas de moedas. Há ainda a "ajuda invisível", que impede a perda de recursos (começa em 30% de chance e cai com a Dragonrot). A doença, aliás, serve mais à narrativa do que gera consequências reais.

**Veredito**

Comparado aos últimos jogos da FromSoftware, o enredo e o mapa são menores, rendendo menos horas de campanha — algo que pode passar despercebido dependendo da habilidade de cada jogador. Trata-se de uma obra impecável, com combate fluido, praticamente sem bugs, que explora os limites de cada jogador e inova na verticalidade e na mecânica de morte. Por outro lado, pode ser curto para os mais habilidosos e tem poucos elementos de personalização.

**Nota: 9/10**${credit("Ian D. Reis")}`,
  },
  {
    path: "/review-far-cry-5.html",
    slug: "review-far-cry-5",
    title: "Review: Far Cry 5 — Hope County, o Pai e o Portão do Éden",
    excerpt: "Liberdade total de missões, pontos de resistência, chefes repetitivos e todos os colecionáveis do quinto jogo da franquia. Nota 9,5.",
    section: "reviews",
    score: 9.5,
    date: "2020-01-14",
    cover: `${U}farcry5_orig.jpg`,
    tags: ["Far Cry 5", "Ubisoft"],
    content: `Quem aí curte a saga Far Cry? Se você realmente curte, deve saber que a saga já está no quinto jogo e que, até o momento, é o melhor da franquia. Opiniões à parte, bora para a review.

O game começa com você chegando em Hope County com um mandado de prisão para Joseph Seed, o "Pai". Você entra na igreja durante uma missa e tem a opção de prender o Pai — escolhendo isso, o jogo começa normalmente. Se decidir não prendê-lo e esperar um pouco, **[spoiler]** você se junta ao Portão do Éden, vai embora e o jogo termina.

![Prisão de Joseph Seed](${U}1522960088912-1522061895245-far-cry-5-arrest-screenshot-01-ps4-us-02mar18_orig.jpeg)

**Gameplay**

Depois de algumas perseguições, você encontra Dutch, seu aliado durante todo o jogo. Ele pede para você trocar de roupa — e aí o game me decepcionou um pouco: nosso personagem não tem uma história própria. Você cria o personagem (masculino ou feminino) e pronto. Em seguida, Dutch pede para liberarmos a ilha dele com algumas missões secundárias, como libertar reféns dos edenitas. E as torres de rádio? Foram tiradas do game, exceto uma, que desbloqueia o sinal da ilha.

Depois da ilha, você escolhe por qual das três regiões começar (de John, Faith e Jacob). Para subir a dificuldade aos poucos, recomendo Jacob, depois Faith e por fim John. Uma coisa muito legal é que não há uma ordem fixa: você faz qualquer missão na hora que quiser.

Os pontos de resistência aumentam a cada missão. Ao atingir certo nível numa região, o dono dela manda os edenitas atrás de você — e não tem como fugir. Na região da Faith, em vez disso, você fica drogado com a tal "bênção".

O que Far Cry 5 repete muito são as batalhas contra chefes: com John e Jacob você só dá uns tiros e pronto; a de Faith tem um cenário diferente, mas é mais do mesmo. E sempre que derrota um chefe, você explode o bunker dele.

**Colecionáveis**

- 12 histórias em quadrinhos espalhadas pelas regiões
- Isqueiros perdidos, geralmente em bunkers
- 10 Bobble Heads do X-Burguer
- 10 discos de vinil, que desbloqueiam partes de uma missão
- 9 cartões de baseball
- 15 barris de uísque perdidos nos lagos

**Nota: 9,5/10**

Não se esqueça de comentar o que achou desse review!${credit("@tsstatee", "14 de janeiro de 2020")}`,
  },
  {
    path: "/review-far-cry-5-lost-on-mars.html",
    slug: "review-far-cry-5-perdido-em-marte",
    title: "Review: Far Cry 5 — Perdido em Marte (DLC)",
    excerpt: "Nick Rye, a cabeça do Hurk e a robô ANNE numa DLC difícil, cheia de aliens e com um mapa bonito de explorar. Nota 7.",
    section: "reviews",
    score: 7,
    date: "2020-01-14",
    cover: `${U}fc5-lost-on-mars_orig.png`,
    tags: ["Far Cry 5", "DLC", "Ubisoft"],
    content: `Far Cry 5 tem três DLCs e hoje vamos falar de Perdido em Marte (a DLC "drogada").

Nela jogamos com Nick Rye, que no Far Cry 5 serve como arma de aluguel. Nick é raptado e levado para Marte, tudo graças ao Hurk. Chegando lá, descobrimos que o Hurk não está com o corpo, só com a cabeça — o resto foi explodido em várias partes do planeta. Aí conhecemos a ANNE, uma robô que diz que precisamos salvar Marte, e a DLC começa.

Para avançar é preciso fazer as missões secundárias, que mais tarde viram missões principais. A que mais faz você progredir é liberar os "postos avançados" (não são bem postos avançados, mas parecem muito), que aumentam as defesas da ANNE.

Essa DLC é mais complicada que Horas de Escuridão: aparecem aliens a todo momento (o visual deles é legal), as armas são ruins e você só mata rápido se acertar o ponto fraco — dois tiros nele, com qualquer arma da DLC.

**Para fazer 100%:**

- achar todas as partes do corpo do Hurk
- matar todas as rainhas
- ler todos os bilhetes do Larry
- fazer as missões do Clutch Nixon (sim, elas voltaram)
- reiniciar todos os terminais
- fazer todas as anomalias geotérmicas

Recomendo explorar o mapa, que é bonito e cheio de detalhes — só cuidado, porque os aliens (principalmente os voadores) vão te fazer passar raiva.

**Nota: 7/10**${credit("@tsstatee", "14 de janeiro de 2020")}`,
  },
  {
    path: "/review-far-cry-5-hours-of-darkness.html",
    slug: "review-far-cry-5-horas-de-escuridao",
    title: "Review: Far Cry 5 — Horas de Escuridão (DLC)",
    excerpt: "Uma DLC no Vietnã sem história de verdade, focada em postos avançados e resgates. O mapa salva, mas pouco. Nota 5.",
    section: "reviews",
    score: 5,
    date: "2020-01-14",
    cover: `${U}fc5-hours-of-darkness_orig.png`,
    tags: ["Far Cry 5", "DLC", "Ubisoft"],
    content: `Se você jogou ou viu vídeos de Far Cry 5, sabe que ele tem três DLCs. Hoje vamos falar de Horas de Escuridão que, na minha opinião, é uma DLC ruim — e vou explicar o porquê.

A história começa com seu personagem e outros soldados em um helicóptero, que cai em uma zona de guerra no Vietnã. Daí para frente começa a ficar ruim: Horas de Escuridão não tem história, só a primeira cena. A DLC toda é sobre fazer missões secundárias e resgatar seus amigos (que são armas de aluguel).

**O jogo**

Você tem poderes especiais de stealth: cada inimigo eliminado furtivamente carrega essas habilidades, mas se for detectado por qualquer inimigo, perde todas.

As missões secundárias são dominar postos avançados (onde estão reféns e alguns dos seus amigos), destruir os lança-mísseis espalhados pelo mapa e derrubar os alto-falantes onde os inimigos falam mal de você.

O que mais achei legal é o mapa: o cenário do Vietnã é complexo e vale a pena explorar alguns locais. O problema é que muitos inimigos vêm atrás de você — a não ser que já tenha dominado os postos e destruído os lança-mísseis.

Depois de resgatar seus amigos, você vai até um ponto do mapa e vai embora, **[spoiler]** encerrando a DLC.

**Nota: 5/10**${credit("@tsstatee", "14 de janeiro de 2020")}`,
  },
  {
    path: "/review-far-cry-new-dawn.html",
    slug: "review-far-cry-new-dawn",
    title: "Review: Far Cry New Dawn — Hope County depois do fim",
    excerpt: "O stand-alone pós-apocalíptico surpreende pela gameplay, mesmo com vilãs genéricas. Veja tudo o que é preciso para fazer 100%. Nota 8.",
    section: "reviews",
    score: 8,
    date: "2020-01-20",
    cover: `${U}fcb-keyart-logo-960-340964_1_orig.jpg`,
    tags: ["Far Cry New Dawn", "Ubisoft"],
    content: `**Aviso: esse review contém spoilers.**

Far Cry New Dawn é um game stand-alone, ou seja, você não precisa ter o Far Cry 5 para jogá-lo. Quando foi anunciado, quase logo depois do lançamento de Far Cry 5, pouca gente entendeu — mas o game surpreende (positivamente).

Se for jogar, recomendo explorar o mapa, porque muitos lugares do Far Cry 5 estão diferentes, como o Complexo do Pai, agora destruído e inundado.

Personagens do game anterior voltam de um jeito diferente: lembra da arma de aluguel Grace Armstrong, a sniper do time? Ela está no jogo, mas não pode entrar no seu time porque está cega — e mesmo assim ainda atira bem (e como).

**Pontos negativos**

As vilãs Mickey e Lou são "sem sal", meio genéricas. A Ubisoft poderia, sim, fazer vilãs tão boas quanto Joseph Seed, de Far Cry 5.

**O que mais gostei**

A gameplay: é bem divertida e, na minha opinião, muito mais que a de Far Cry 5. Uma das coisas mais legais é a faca — sim, ela está de volta. Outra coisa que deixa tudo mais divertido são os "poderes" que você ganha em certa parte do jogo.

**Para fazer 100%:**

- completar o modo história
- fazer as 8 missões paralelas
- completar os postos avançados (e repeti-los)
- caçar os 10 tesouros
- completar as 10 expedições
- melhorar sua base por completo
- recrutar os 5 especialistas e as 8 armas de aluguel
- desbloquear as 30 vantagens
- completar os 105 desafios
- coletar as 9 fotografias e os 10 aparelhos de música
- saquear os 101 locais de equipamentos

**Nota: 8/10**${credit("@tsstatee", "20 de janeiro de 2020")}`,
  },
  {
    path: "/review-far-cry-3-classic-edition.html",
    slug: "review-far-cry-3-classic-edition",
    title: "Review: Far Cry 3 Classic Edition — o clássico remasterizado",
    excerpt: "Gráficos novos, sons de armas refeitos e todas as DLCs inclusas: vale a pena voltar à ilha de Vaas? Nota 9.",
    section: "reviews",
    score: 9,
    date: "2020-01-20",
    cover: `${U}imagem1_orig.png`,
    tags: ["Far Cry 3", "Ubisoft", "Remaster"],
    content: `Quem aí não ama o Far Cry 3? Fizemos a review da Classic Edition, lançada para os consoles da geração passada — e que, por sinal, está maravilhosa.

Nessa versão mudou muita coisa: gráficos muito melhores e o som das armas, como a AK-47 e as armas montadas. Foi uma das melhores mudanças, mas de vez em quando sinto falta dos sons originais. Algumas falhas antigas continuam, como subir em paredes usando certos objetos e às vezes até ver o outro lado.

Se você tinha a versão de PS3 ou Xbox 360 e não jogou as DLCs, é uma boa oportunidade: a Classic Edition vem com todo o conteúdo adicional, como as missões do Hurk e a Faca Tribal.

Se você tem conta no Ubisoft Club, vale gastar seus pontos nas recompensas, como uma arma de assinatura — lembrando que ela não acelera o progresso do 100%.

**Colecionáveis e missões**

Quem já fez 100% nas versões anteriores fará de olhos fechados: não há nada novo. Entre os colecionáveis estão as relíquias, cada uma representando um animal — a garça fica em lugares altos, o tubarão na água, o javali em pequenas cavernas e as da aranha em pontos de difícil acesso. As Tarefas da História são chatas, mas rendem novas seringas, então vale a pena. As entregas de suprimentos são liberadas ao ativar torres de rádio ou dominar postos avançados.

Não sei se é impressão minha, mas certas partes da história parecem mais difíceis no modo Mestre, a dificuldade mais alta.

O modo história ficou ainda mais épico com os gráficos novos: partes que eram escuras ficaram mais claras, e aquela clássica cena da definição de insanidade ficou muito mais marcante.

**Nota: 9/10**${credit("@tsstatee", "20 de janeiro de 2020")}`,
  },
  {
    path: "/review-spider-man-ps4.html",
    slug: "review-marvels-spider-man-ps4",
    title: "Review: Marvel's Spider-Man (PS4) — balançar por Manhattan nunca foi tão bom",
    excerpt: "Tempo de jogo, trajes, modo foto, New Game+ e DLCs do exclusivo da Insomniac Games.",
    section: "reviews",
    date: "2020-01-01",
    cover: `${U}fdsafsd_orig.jpg`,
    tags: ["Spider-Man", "Insomniac", "PS4"],
    content: `Quem jogou o game do Homem-Aranha para PS4? Se você ainda não jogou, vamos contar o que tem no game e dar nossa opinião.

Marvel's Spider-Man foi desenvolvido pela Insomniac Games e lançado em 7 de setembro de 2018 como exclusivo do PS4. Você realmente se sente como o Homem-Aranha: explora Manhattan praticamente inteira e, o mais legal, se balança com as teias como o teioso. Ao longo do jogo você melhora os lançadores de teia, que ajudam no combate e na velocidade de deslocamento.

**Tempo de jogo**

Você leva no mínimo 20 horas para zerar, mas isso varia de jogador para jogador. O que não gostei foi fazer o 100%: é repetitivo, com tarefas como derrotar criminosos em todos os distritos e missões secundárias chatas, como pegar pombos.

Conforme avança, você sobe de nível e desbloqueia a fabricação de trajes — uma das melhores coisas do jogo, mas que exige muitas Fichas de Crime. Todos os trajes são legais, mas meus preferidos são o HQ Clássica, o Spider-Man Caveira e o traje do Big Time.

Outra coisa muito legal é o modo foto, com bordas, selfies, filtros e mais. Fizemos uma personalização para mostrar:

![](${U}selfie_orig.jpg)

**Extras**

Ao terminar o jogo, você desbloqueia o New Game+, começando com tudo que tinha. Para os troféus desse modo, recomendamos a dificuldade "Suprema", que tem seus desafios mas ainda é tranquila.

O game tem três DLCs com novos episódios (Silver Linings, Turf Wars e The Heist) e trajes novos, como a versão clássica do Iron Spider. Há também trajes gratuitos, como o da trilogia de filmes do Homem-Aranha, disponíveis na PlayStation Store.${credit("@tstatee", "1º de janeiro de 2020")}`,
  },
  {
    path: "/tudo-que-rolou-no-tga-2019.html",
    slug: "the-game-awards-2019-tudo-que-rolou",
    title: "The Game Awards 2019: Sekiro leva o GOTY e Xbox Series X é revelado",
    excerpt: "Vencedores, anúncios e trailers do 'Oscar dos Games' de 2019 — do novo Xbox ao primeiro jogo de PS5.",
    section: "noticias",
    date: "2019-12-15",
    cover: `${U}tga-cover_orig.jpg`,
    tags: ["The Game Awards", "TGA 2019", "GOTY"],
    content: `Todo ano acontece o The Game Awards, e em 2019 não foi diferente: o evento rolou em 12/12/19. Se você perdeu, a gente conta o que aconteceu.

**Quem ganhou o Jogo do Ano (GOTY)**

Os indicados eram Death Stranding (Kojima Productions/SIE), Resident Evil 2 Remake (Capcom), Super Smash Bros. Ultimate (Bandai Namco/Sora/Nintendo), The Outer Worlds (Obsidian/Private Division), Sekiro: Shadows Die Twice (FromSoftware/Activision) e Control (Remedy/505 Games).

Se você apostou em **Sekiro**, acertou: levou o prêmio de melhor jogo do ano — muito merecido.

**Novo Xbox**

![Xbox Series X](${U}xbox-series-x_orig.jpg)

A Microsoft revelou seu novo console, o **Xbox Series X**, rival do **PlayStation 5**, previsto para o fim de 2020 e já com um jogo anunciado: Senua's Saga: Hellblade II.

https://www.youtube.com/watch?v=qJWI4bkD9ZM

**Outros anúncios**

**Marvel Ultimate Alliance 3:** novo pacote de DLC focado nos X-Men, com Gambit, Homem de Gelo, Cable e Fênix Negra.

**Final Fantasy VII Remake:** novo trailer focado em Cloud Strife e sua relação com o grupo.

**Velozes e Furiosos: Encruzilhada:** novo jogo da franquia, previsto para PS4, Xbox One e PC.

**Mortal Kombat 11:** trailer do Coringa, que chegou de graça para quem comprou o Kombat Pack.

**Godfall:** o primeiro jogo anunciado para PlayStation 5, também com versão na Epic Games Store.

**Bravely Default 2:** novo exclusivo do Nintendo Switch.

**Prologue:** projeto misterioso da PlayerUnknown, criador de PUBG.

**Ori and the Will of the Wisps:** novo trailer e uma notícia triste — o jogo foi adiado de fevereiro para março de 2020.

**Gears Tactics:** data de lançamento revelada; a história se passa 12 anos antes do primeiro Gears of War.

**Cyberpunk 2077:** prévia da trilha sonora e um vídeo de bastidores.

**Ghost of Tsushima:** novo trailer, com rumores de lançamento em 2020 como exclusivo de PS4.

**Outros vencedores**

- Melhor direção: Death Stranding
- Melhor jogo de ação e aventura: Sekiro: Shadows Die Twice
- Melhor jogo indie, narrativa e RPG: Disco Elysium
- Escolha dos fãs e melhor jogo de estratégia: Fire Emblem: Three Houses
- Melhor performance: Mads Mikkelsen
- Melhor jogo de VR: Beat Saber
- Melhor jogo de e-sports: League of Legends
- Melhor jogo em andamento: Fortnite
- Melhor suporte à comunidade: Destiny 2
- Melhor multiplayer: Apex Legends
- Melhor jogo mobile: Call of Duty: Mobile
- Melhor jogo para a família: Luigi's Mansion 3
- Melhor jogo de ação: Devil May Cry 5
- Melhor jogo de luta: Super Smash Bros. Ultimate
- Melhor arte: Control
- Melhor trilha sonora: Death Stranding
- Melhor design de áudio: Call of Duty: Modern Warfare
- Games for Impact: Gris
- Criador de conteúdo do ano: Shroud
- Melhor jogador de e-sports: Bugha
- Melhor time de e-sports: G2 Esports
- Melhor evento de e-sports: LoL World Championship 2019${credit("@tsstatee", "15 de dezembro de 2019")}`,
  },
  {
    path: "/devil-may-cry-5-revelado.html",
    slug: "devil-may-cry-5-trailer-gamescom-2018",
    title: "Devil May Cry 5: trailer da gamescom confirma lançamento em março de 2019",
    excerpt: "Nero com os Devil Breakers e Dante transformando a moto em duas espadas no novo trailer de DMC5.",
    section: "noticias",
    date: "2018-08-21",
    cover: `${U}dmc5-1_2_orig.jpg`,
    tags: ["Devil May Cry 5", "Capcom", "gamescom"],
    content: `**Vai jogar? Sim ou claro que sim?**

O novo trailer de Devil May Cry 5, divulgado durante a gamescom 2018, confirmou a data de lançamento do game para março de 2019. No vídeo, podemos conferir diversos inimigos que Nero enfrentará com o auxílio dos Devil Breakers, incluindo um braço mecânico que oferece muitas habilidades animais e sangrentas.

https://www.youtube.com/watch?v=1kVr57k47js

Além de Nero, dá para ver os golpes de Dante, que usa sua moto como arma e, como se não bastasse, ainda pode separá-la ao meio e transformar cada parte em uma espada.

![](${U}dmc5-2_3_orig.jpg)

![](${U}dmc5-3_1_orig.jpg)${credit("", "agosto de 2018")}`,
  },
  {
    path: "/duas-semanas-de-games-gratis-epic-games-store.html",
    slug: "epic-games-store-jogo-gratis-por-dia-dezembro-2019",
    title: "Epic Games Store dá um jogo grátis por dia durante duas semanas",
    excerpt: "Para celebrar as festas, a loja distribuiu 12 jogos gratuitos entre 19 de dezembro e 1º de janeiro.",
    section: "games",
    date: "2019-12-18",
    cover: `${U}apagar3_orig.jpg`,
    tags: ["Epic Games Store", "Jogos grátis", "PC"],
    content: `Para celebrar as festas de fim de ano, a Epic Games Store, famosa loja de games digitais, vai distribuir jogos gratuitos ao longo de duas semanas. Todos os dias um jogo novo fica disponível.

Ao todo, serão 12 títulos — com isso, dois dias ficarão sem jogos novos, possivelmente o Natal e o Ano Novo. A distribuição começa na quinta-feira (19) e vai até 1º de janeiro.

A empresa ainda não divulgou a lista dos jogos, mas até lá é possível resgatar [The Wolf Among Us](https://store.epicgames.com/pt-BR/p/the-wolf-among-us) e [The Escapists](https://store.epicgames.com/pt-BR/p/the-escapists), gratuitos até amanhã (19), quando o primeiro jogo da série será liberado.

![The Escapists e The Wolf Among Us gratuitos na Epic Games Store](${U}apagar3_orig.jpg)

Para resgatar, basta criar uma conta no [site oficial](https://store.epicgames.com/pt-BR/). Os jogos podem ser resgatados pelo navegador, mas para jogar é preciso baixar o launcher da plataforma.${credit("Merehj", "18 de dezembro de 2019")}`,
  },
  {
    path: "/games-gratis-ps-plus.html",
    slug: "ps-plus-dezembro-2019-titanfall-2-monster-energy-supercross",
    title: "PS Plus de dezembro de 2019: Titanfall 2 e Monster Energy Supercross",
    excerpt: "Os jogos gratuitos da PlayStation Plus no último mês de 2019.",
    section: "games",
    date: "2019-12-03",
    cover: `${U}titanfall2_orig.jpg`,
    tags: ["PS Plus", "PS4", "Jogos grátis"],
    content: `E aí, pessoal! Nesse artigo mostramos os jogos gratuitos da PlayStation Plus de dezembro.

**Titanfall 2**

![](${U}titanfall2_orig.jpg)

"Na campanha solo, um Piloto ambicioso e um Titã veterano combinam forças para salvar suas vidas e enfrentar um inimigo poderoso. O multijogador oferece novos Titãs, habilidades expandidas de Piloto e personalização mais complexa para elevar a jogabilidade frenética e empolgante que os fãs esperam da série."

**Monster Energy Supercross — The Official Videogame**

![](${U}monster-energy-supercross_orig.jpg)

"Viva a adrenalina e o entusiasmo do Monster Energy Supercross Championship 2017! Dispute nos circuitos oficiais (Daytona incluído) com os pilotos oficiais das categorias 250SX e 450SX."${credit("", "dezembro de 2019")}`,
  },
  {
    path: "/xbox-live-dezembro.html",
    slug: "xbox-live-gold-dezembro-2019-jogos-gratis",
    title: "Xbox Live Gold de dezembro de 2019: os jogos grátis do mês",
    excerpt: "Insane Robots, Jurassic World Evolution, Toy Story 3 e Castlevania: Lords of Shadow – Mirror of Fate.",
    section: "games",
    date: "2019-12-02",
    cover: `${U}jurassic-world_orig.jpg`,
    tags: ["Xbox Live Gold", "Xbox One", "Jogos grátis"],
    content: `Fala, pessoal! Estes são os jogos disponíveis de graça na Xbox Live Gold.

**Insane Robots**

![](${U}insane-robots_orig.jpg)

Jogo de estratégia baseado em turnos, desenvolvido e publicado pela Playniac. Lançado para PlayStation 4, Xbox One, macOS e Windows.

**Jurassic World Evolution**

![](${U}jurassic-world_orig.jpg)

Simulador de gestão desenvolvido e publicado pela Frontier Developments, baseado no filme Jurassic World (2015). Lançado em 12 de junho de 2018 para Windows, PlayStation 4 e Xbox One.

**Toy Story 3: The Game**

![](${U}toy-story-3_orig.jpg)

Baseado no filme Toy Story 3, foi publicado pela Disney Interactive Studios e desenvolvido pela Avalanche Software. Lançado em 2010 para PS3, Xbox 360, PS2 (versão totalmente diferente), Wii, PSP, Nintendo DS, Windows, iOS e Mac.

**Castlevania: Lords of Shadow – Mirror of Fate**

![](${U}castlevania_orig.png)

Sequência direta do reboot da série, produzida pela MercurySteam e lançada em 5 de março de 2013 para PS3, Xbox 360, Nintendo 3DS e Windows.${credit("", "dezembro de 2019")}`,
  },
  {
    path: "/ps-plus-abril-2019.html",
    slug: "ps-plus-abril-2019-conan-exiles-the-surge",
    title: "PS Plus de abril de 2019: Conan Exiles e The Surge",
    excerpt: "Sobrevivência em mundo aberto e um RPG de ação no estilo Souls: os jogos gratuitos da PS Plus de abril.",
    section: "games",
    date: "2019-04-02",
    cover: "https://i.ytimg.com/vi/-puWjrKm4-o/hqdefault.jpg",
    tags: ["PS Plus", "PS4", "Conan Exiles", "The Surge"],
    content: `A Sony divulgou os games gratuitos que os assinantes da PS Plus poderão baixar em abril. Sem mais delongas, bora pra notícia:

**Conan Exiles**

Disponível por muito tempo no Acesso Antecipado da Steam e lançado depois para consoles, Conan Exiles é um game de sobrevivência em mundo aberto protagonizado pelo personagem homônimo. O menu de personalização (com opções masculina e feminina) é bastante complexo e permite deixar o personagem do jeitinho que você preferir.

https://www.youtube.com/watch?v=-puWjrKm4-o

**The Surge**

RPG de ação do estúdio Deck13, com um protagonista equipado com um exoesqueleto, em um mundo futurista cercado por guerra e ameaçado pelo aquecimento global. A jogabilidade é muito parecida com a série Souls/Bloodborne. O game não ficou muito conhecido, mas é ótimo e garante horas de diversão e desafios.

https://www.youtube.com/watch?v=eoa5pFOFQrY${credit("", "abril de 2019")}`,
  },
  {
    path: "/20-jogos-de-nes-gratis.html",
    slug: "nintendo-switch-online-20-jogos-de-nes",
    title: "Nintendo Switch Online chega com 20 jogos de NES",
    excerpt: "O serviço online da Nintendo traz partidas online, saves na nuvem e uma coleção de clássicos do NES — veja a lista.",
    section: "games",
    date: "2018-09-20",
    cover: `${U}nes-switch-online-main_orig.jpg`,
    tags: ["Nintendo Switch", "Nintendo Switch Online", "NES"],
    content: `A Nintendo está sempre reinventando maneiras de cativar jogadores, seja pela coleção de ótimos games, seja pela nostalgia. Com o recém-lançado Nintendo Switch Online, que custa US$ 20 por ano (ou US$ 8 por três meses e US$ 4 por mês), é possível jogar online Mario Kart 8 Deluxe, Splatoon 2 e Arms, além de batalhar e trocar monstrinhos em Pokémon Let's Go Pikachu & Let's Go Eevee. O serviço também traz saves na nuvem — algo já esperado, como na PSN e na Xbox Live, mas por um preço mais acessível.

A assinatura inclui uma seleção de 20 clássicos do NES (Nintendo Entertainment System), da década de 80. Todos têm save slots para salvar a qualquer hora e, quando o jogo permite, partidas online: dá para jogar Pro Wrestling online ou revezar no Super Mario com um amigo que mora longe. A Nintendo prometeu adicionar mais títulos, como Metroid e Ninja Gaiden.

**Os 20 jogos de lançamento**

- Super Mario Bros. 3
- The Legend of Zelda
- Super Mario Bros.
- River City Ransom
- Gradius
- Tecmo Bowl
- Pro Wrestling
- Dr. Mario
- Ghosts 'n Goblins
- Excitebike
- Mario Bros.
- Ice Climber
- Balloon Fight
- Ice Hockey
- Double Dragon
- Donkey Kong
- Yoshi
- Tennis
- Baseball
- Soccer${credit("", "setembro de 2018")}`,
  },
  {
    path: "/live-ign-super-smash-bros.html",
    slug: "super-smash-bros-ultimate-live-ign-vespera-lancamento",
    title: "Super Smash Bros. Ultimate: a live da IGN na véspera do lançamento",
    excerpt: "O hype estava absurdo: a IGN americana transmitiu a jogabilidade do game um dia antes da estreia.",
    section: "games",
    date: "2018-12-06",
    cover: "https://i.ytimg.com/vi/2cKuYkBQ97c/hqdefault.jpg",
    tags: ["Super Smash Bros. Ultimate", "Nintendo Switch"],
    content: `Super Smash Bros. Ultimate lança amanhã, e o hype está em um nível absurdo por aqui na Buff. E vocês, como estão?

O [canal americano da IGN](https://www.youtube.com/@IGN) está transmitindo um pouco da jogabilidade do game e resolvemos mostrar para vocês:

https://www.youtube.com/watch?v=2cKuYkBQ97c

Conta pra gente nos comentários o que achou do game até agora!${credit("", "dezembro de 2018")}`,
  },
  {
    path: "/final-fantasy-vii-remake.html",
    slug: "final-fantasy-vii-lives-na-twitch",
    title: "Final Fantasy VII: nossas lives na Twitch no clima do Remake",
    excerpt: "Para entrar no clima do Remake, jogamos o Final Fantasy VII original de PS1 ao vivo na Twitch.",
    section: "games",
    date: "2020-04-07",
    tags: ["Final Fantasy VII", "Twitch", "Lives"],
    content: `Galera, sabemos que vocês estão tão ansiosos quanto nós aqui da Buff or Die pelo Final Fantasy VII Remake. Por isso, resolvemos trazer o game original, lançado para PlayStation 1: nos dias 08/04/20 e 09/04/20 fizemos lives para entrar no clima!

Para acompanhar nossas lives, é só seguir o canal [twitch.tv/buffordie](https://www.twitch.tv/buffordie).

Ter uma conta na Twitch não é necessário para assistir, mas recomendamos, porque assim vocês podem interagir conosco — e criar uma conta é de graça.${credit("", "abril de 2020")}`,
  },
  {
    path: "/overwatch_dark_souls.html",
    slug: "overwatch-encontra-dark-souls-crossover-de-fa",
    title: "E se Overwatch fosse Dark Souls? Fã recria o mundo da Blizzard no estilo sombrio",
    excerpt: "O canal TGN reimaginou Overwatch com a temática sinistra do jogo da FromSoftware — e o resultado é uma obra-prima.",
    section: "games",
    date: "2019-03-10",
    cover: "https://i.ytimg.com/vi/5Fy2DpSf1zY/hqdefault.jpg",
    tags: ["Overwatch", "Dark Souls"],
    content: `Já imaginou como seria um crossover entre o mundo coloridíssimo de Overwatch e o universo sombrio de Dark Souls?

O canal TGN fez um vídeo muito interessante recriando o mundo de Overwatch com a temática sinistra de Dark Souls, game da japonesa FromSoftware. Confiram essa obra-prima — e fica a dica para seguir o canal, os caras são ótimos!

https://www.youtube.com/watch?v=5Fy2DpSf1zY

E aí? O que acharam dessa ideia? Seria ótimo ver um crossover oficial desse tipo?${credit("")}`,
  },
  {
    path: "/overwatch-evolucao.html",
    slug: "a-evolucao-visual-de-overwatch",
    title: "A evolução de Overwatch: do patinho feio ao jogo que amamos",
    excerpt: "Um vídeo mostra como o visual e os heróis de Overwatch mudaram desde as primeiras versões.",
    section: "games",
    date: "2018-10-15",
    cover: "https://i.ytimg.com/vi/CBFrwRXUV-g/hqdefault.jpg",
    tags: ["Overwatch", "Blizzard"],
    content: `Overwatch nem sempre foi esse game lindo e colorido que tanto amamos. Um dia, ele já foi um patinho feio, como todos nós.

Confira abaixo o vídeo sobre a evolução do jogo, do canal [Gaming Curious no YouTube](https://www.youtube.com/channel/UCAuI-Z03JwnDsVAwB5G2tfw).

https://www.youtube.com/watch?v=CBFrwRXUV-g

Conta para a gente nos comentários o que achou das mudanças que o game sofreu ao longo dos anos!${credit("")}`,
  },
  {
    path: "/ashe-review-overwatch.html",
    slug: "overwatch-ashe-guia-da-heroina",
    title: "Overwatch: conheça Ashe, a pistoleira com a Víbora e o B.O.B.",
    excerpt: "Arma principal, escopeta, dinamite e a suprema B.O.B.: tudo sobre a heroína de dano anunciada na BlizzCon 2018.",
    section: "competitivo",
    date: "2018-11-13",
    cover: "http://buffordie.com.br/uploads/8/9/5/9/89592829/published/ashe_1.png",
    tags: ["Overwatch", "Ashe", "Blizzard"],
    content: `Ashe foi anunciada oficialmente durante a BlizzCon 2018 e também apareceu no curta animado de McCree. Ela é uma personagem de dano que usa um rifle semiautomático como arma principal.

Graças ao seu arsenal, Ashe é capaz de criar diferentes situações durante a partida. É uma heroína ofensiva versátil, que causa dano à distância ou muito dano em área contra grupos de heróis.

**Víbora**

Sua arma primária é a Víbora, um rifle de alavanca com dois modos: semiautomático e mira. No semiautomático ela dispara rapidamente, mas os projéteis têm alta dispersão; no modo mira, os disparos são mais precisos e causam mais dano, ao custo da velocidade.

**Escopeta**

A arma secundária causa dano a curta distância e afasta os inimigos, abrindo caminho para outras jogadas. Ela também pode lançar Ashe para cima, como um famoso rocket jump.

**Dinamite**

Ashe arremessa um explosivo que detona após alguns segundos, causando dano em área e incendiando os inimigos. Ela também pode atirar na dinamite para fazê-la explodir antes da hora.

**B.O.B. (suprema)**

Seu companheiro ômnico avança contra os adversários, abrindo caminho e atirando com suas metralhadoras.${credit("", "novembro de 2018")}`,
  },
  {
    path: "/top-10-atalhos-menos-usados-overwatch.html",
    slug: "overwatch-atalhos-menos-usados-nos-mapas",
    title: "Overwatch: os atalhos menos usados que podem evitar derrotas",
    excerpt: "Em mapas grandes como King's Row, Dorado e Templo de Anúbis, voltar rápido ao combate faz diferença. Veja os caminhos alternativos.",
    section: "competitivo",
    date: "2018-10-01",
    cover: "https://i.ytimg.com/vi/zO_Goj9q3AI/hqdefault.jpg",
    tags: ["Overwatch", "Dicas", "Mapas"],
    content: `Overwatch é um game para se jogar em equipe, mas muitas vezes nos encontramos isolados dos colegas e acabamos morrendo para os inimigos. Em mapas grandes como King's Row, Dorado e Templo de Anúbis, demorar para voltar ao combate pode custar a partida.

Pensando nisso, o canal TGN no YouTube publicou um vídeo mostrando alguns dos atalhos menos utilizados, que deveriam ser muito mais explorados por todos:

https://www.youtube.com/watch?v=zO_Goj9q3AI

E aí, conhecia todos esses caminhos? Conta pra gente nos comentários se o vídeo te ajudou!${credit("")}`,
  },
  {
    path: "/paciencia-zero-preconceito.html",
    slug: "overwatch-nao-toleramos-preconceito",
    title: "Isso ainda acontece? Não toleramos preconceito nos games",
    excerpt: "Uma jogadora Diamante de Overwatch foi alvo de ataques em partida ranqueada. Denuncie e respeite os outros jogadores.",
    section: "competitivo",
    date: "2019-01-05",
    cover: "https://i.ytimg.com/vi/zpoDtWuyU-c/hqdefault.jpg",
    tags: ["Overwatch", "Comunidade", "Toxicidade"],
    content: `Overwatch é um ótimo jogo, todo mundo sabe disso: inclusivo, com um vasto lore e personagens completamente diferentes entre si, com personalidades complexas. É uma ótima porta de entrada para o mundo dos e-sports, divertido tanto para iniciantes quanto para pro players. Mas a comunidade tem muito a melhorar por causa da toxicidade de alguns jogadores (com 40 milhões de jogadores, fica difícil não ter trolls e gente de má-fé) — felizmente, a Blizzard trabalha dia após dia para combater esse comportamento.

No dia 30 de dezembro, uma jogadora chamada "deusa-_-hard" (ótima jogadora, aliás, no rank Diamante) foi vítima de comportamentos horríveis, que muitos consideram criminosos, sem ter feito absolutamente nada para provocar a atitude dos jogadores tóxicos.

Confiram o vídeo abaixo — mas atenção: linguagem pesada, tirem as crianças da sala!

https://www.youtube.com/watch?v=zpoDtWuyU-c

Estamos exagerando, ou esses caras realmente pisaram na bola?

Denunciem sempre que acharem necessário e compartilhem para que mais pessoas se conscientizem: não é só porque tem um monitor na sua frente que as pessoas não podem ser machucadas. Respeitem os outros jogadores.${credit("", "janeiro de 2019")}`,
  },
];

/** Páginas institucionais/índices do site antigo → seções novas. */
export const legacyPageRedirects: Record<string, string> = {
  "/index.html": "/",
  "/reviews.html": "/secao/reviews",
  "/blog.html": "/secao/noticias",
  "/videos.html": "/secao/games",
  "/eventos.html": "/secao/competitivo",
  "/overwatch.html": "/busca?q=overwatch",
  "/ps4.html": "/busca?q=ps4",
  "/xbox-one.html": "/busca?q=xbox",
  "/nintendo.html": "/busca?q=nintendo",
  "/nintendo-switch.html": "/busca?q=switch",
  "/sekiro-shadows-die-twice.html": "/noticias/review-sekiro-shadows-die-twice",
  "/red-dead-redemption2.html": "/noticias/review-red-dead-redemption-2",
  "/spider-man-ps4.html": "/noticias/review-marvels-spider-man-ps4",
  "/the-game-awards-2019.html": "/noticias/the-game-awards-2019-tudo-que-rolou",
  "/games-graacutetis-da-plus-e-xbox-live.html": "/noticias/ps-plus-dezembro-2019-titanfall-2-monster-energy-supercross",
};
