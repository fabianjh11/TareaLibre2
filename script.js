// Obtener las etiquetas de HTML
const board = document.getElementById('Board');
const score_board = document.getElementById('ScoreBoard');
const button_ = document.getElementById('Play');
const game_over_sign = document.getElementById('GameOver');

// Características del juego
const board_size = 10;
const game_speed = 100;
const cell_types = {
	EmptyCell: 0,
	SnakeCell: 1,
	ItemCell: 2
};
const directions = {
	ArrowUp: -10,
	KeyW: -10,
	ArrowDown: 10,
	KeyS: 10,
	ArrowLeft: -1,
	KeyA: -1,
	ArrowRight: 1,
	KeyD: 1
};

// Variables del juego
let snake;
let score;
let direction;
let board_cells;
let empty_cells;
let move_interval;

const draw_snake = () =>
{
	snake.forEach( cell => draw_cell(cell, 'SnakeCell'));
};

const draw_cell = (cell, type) => 
{
	const [ row, column ] = cell.split('');
	board_cells[row][column] = cell_types[type];

	const cell_element = document.getElementById(cell);
	cell_element.setAttribute('class', `Cell ${type}`);

	if(type === 'EmptyCell')
	{
		empty_cells.push(cell);
	}
	else
	{
		if(empty_cells.indexOf(cell) !== -1)
		{
			empty_cells.splice(empty_cells.indexOf(cell), 1);
		}
	}
};

const move_snake = () =>
{
	const new_cell = String(Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0');
	const [row, column] = new_cell.split('');

	if(new_cell < 0 || new_cell > board_size * board_size ||
		((direction === 'ArrowLeft' || direction === 'KeyA') && column == 9) ||
		((direction === 'ArrowRight' || direction === 'KeyD') && column == 0) ||
		board_cells[row][column] === cell_types['SnakeCell'])
	{
		game_over();
	}
	else
	{
		snake.push(new_cell);
		if (board_cells[row][column] === cell_types['ItemCell'])
		{
			score++;
			update_score();
			create_item();
		}
		else
		{
			const empty_cell = snake.shift();
			draw_cell(empty_cell, 'EmptyCell');
		}
		draw_snake();
	}

};

const game_over = () =>
{
	game_over_sign.style.display = 'block';
	clearInterval(move_interval);
	button_.style.display = 'inline-block';
};

const create_board = () =>
{
	// Vamos a crear cada uno de los recuadros del tablero
	// iremos por cada fila y cada una de sus columnas
	board_cells.forEach( (row, row_index) =>
	{
		row.forEach( (column, column_index) =>
		{
			// Creamos una variable que almacene la posición de la celda
			const cell_value = `${row_index}${column_index}`;
			// Creamos un DIV que representará cada celda del tablero,
			// a este le asignaremos las clases y el id
			const cell_element = document.createElement('div');
			cell_element.setAttribute('class', 'Cell EmptyCell');
			cell_element.setAttribute('id', cell_value);
			// Añadimos el elemento creado a nuestro DIV del tablero
			board.appendChild(cell_element);
			// Añadimos a arreglo de las celdas vacías esta nueva celda
			empty_cells.push(cell_value);
		});
	});
};

const set_game = () =>
{
	// Posición inicial de la serpiente
	snake = ['40', '41', '42', '43'];

	var temp;
	temp = snake.length - 4;
	score = temp;
	
	// Dirección inicial de movimiento
	direction = 'ArrowRight';

	// Crear el arreglo de dos dimensiones que guarde la información sobre el tablero y cómo se va a dibujar
	board_cells = Array.from(Array(board_size), () => new Array(board_size).fill(cell_types.empty_cell));

	// Limpiar el contenido del tablero (el DIV de HTML)
	board.innerHTML = '';
	empty_cells = [];

	create_board();
};

const update_score = () =>
{
	score_board.innerText = score;
};

const create_item = () =>
{
	const item = empty_cells[Math.floor(Math.random() * empty_cells.length)];
	draw_cell(item, 'ItemCell');
};

const set_direction = (new_direction) =>
{
	direction = new_direction;
};

const direction_event = (key) =>
{
	if ((key.code === 'ArrowUp' || key.code === 'KeyW') && (direction !== 'ArrowDown' && direction !== 'KeyS'))
	{
		set_direction(key.code);
		console.log(direction);
		return;
	}
	if ((key.code === 'ArrowDown' || key.code === 'KeyS') && (direction !== 'ArrowUp' && direction !== 'KeyW'))
	{
		set_direction(key.code);
		console.log(direction);
		return;
	}
	if ((key.code === 'ArrowLeft' || key.code === 'KeyA') && (direction !== 'ArrowRight' && direction !== 'KeyD'))
	{
		set_direction(key.code);
		console.log(direction);
		return;
	}
	if ((key.code === 'ArrowRight' || key.code === 'KeyD') && (direction !== 'ArrowLeft' && direction !== 'KeyA'))
	{
		set_direction(key.code);
		console.log(direction);
		return;
	}
};

const start_game = () => 
{
	set_game();
	game_over_sign.style.display = 'none';
	button_.style.display = 'none';
	draw_snake();
	update_score();

	create_item();

	document.addEventListener('keydown', direction_event);

	move_interval = setInterval( () => move_snake(), game_speed);
};

button_.addEventListener('click', start_game);