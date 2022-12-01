```
let mapleader=" "

set encoding=UTF-8

set number
set showcmd
set incsearch
set ignorecase
set scrolloff=5
set clipboard=unnamed

set smartindent
set expandtab
set tabstop=4
set shiftwidth=4
set softtabstop=4

map <Home> ^
map <End> $
nnoremap <leader>ca ggVG

" vim-plug
call plug#begin()
    Plug 'ryanoasis/vim-devicons'
    Plug 'joshdick/onedark.vim'
    Plug 'vim-airline/vim-airline'
    Plug 'vim-airline/vim-airline-themes'

    Plug 'terryma/vim-multiple-cursors'
    Plug 'preservim/nerdtree'
    Plug 'easymotion/vim-easymotion'
    Plug 'tpope/vim-commentary'
call plug#end()

syntax on
colorscheme onedark
let g:airline_theme='onedark'

let NERDTreeMapOpenVSplit='v'
let NERDTreeMapPreviewVSplit='gv'
let NERDTreeMapOpenSplit='s'
let NERDTreeMapPreviewSplit='gs'

nnoremap <leader>nt :NERDTreeToggle<CR>
nnoremap <leader>nc :NERDTreeFind<CR>
nnoremap <leader>nf :NERDTreeFocus<CR>

nmap <leader>/ <Plug>(easymotion-bd-fn)
nmap <leader>; <Plug>(easymotion-next)
nmap <leader>, <Plug>(easymotion-prev)

if has('gui_running')
    set guifont=JetBrainsMono\ Nerd\ Font\ Mono:h13
endif

" intellij
if has('ide')
    set ideajoin

    nmap <leader>* <Action>(FindUsages)
    nmap <leader>o <Action>(GotoFile)
    nmap <leader>f <Action>(FindInPath)
    nmap <leader>t <Action>(HideAllWindows)

    nmap <leader>up <Action>(Vcs.UpdateProject)
    nmap gd <Action>(GotoDeclaration)
    nmap gD <Action>(GotoImplementation)
    nmap ]m <Action>(MethodDown)
    nmap [m <Action>(MethodUp)

    " navigation
    nmap <leader>nr <Action>(RecentFiles)
    nmap <leader>nl <Action>(RecentLocations)

    " code
    nmap <leader>cd <Action>(Debug)
    nmap <leader>cr <Action>(Run)
    nmap == <Action>(ReformatCode)
    nmap <leader>co <Action>(OptimizeImports)

    nmap <leader>gg <Action>(Generate)
    nmap <leader>gc <Action>(GenerateConstructor)
    nmap <leader>go <Action>(OverrideMethods)
    nmap <leader>gi <Action>(ImplementMethods)
    nmap <leader>cn <Action>(NewElementSamePlace)

    " show
    nmap <leader>sd <Action>(QuickJavaDoc)
    nmap <leader>sp <Action>(ParameterInfo)
    nmap <leader>ss <Action>(FileStructurePopup)

    " refactor
    vmap <leader>rm <Action>(ExtractMethod)
    nmap <leader>rn <Action>(RenameElement)

    " vim-multiple-cursors
    nmap <C-n> <Plug>NextWholeOccurrence
    xmap <C-n> <Plug>NextWholeOccurrence
    nmap g<C-n> <Plug>NextOccurrence
    xmap g<C-n> <Plug>NextOccurrence
    nmap <C-x> <Plug>SkipOccurrence
    xmap <C-x> <Plug>SkipOccurrence
    nmap <C-p> <Plug>RemoveOccurrence
    xmap <C-p> <Plug>RemoveOccurrence
    nmap <S-C-n> <Plug>AllWholeOccurrences
    xmap <S-C-n> <Plug>AllWholeOccurrences
    nmap g<S-C-n> <Plug>AllOccurrences
    xmap g<S-C-n> <Plug>AllOccurrences
endif
```
