# ddu-kind-extcmd
This plugin is ddu.vim kind to execute external commands.

# Required
* [vim-denops/denops.vim](https://github.com/vim-denops/denops.vim)
* [Shougo/ddu.vim](https://github.com/Shougo/ddu.vim)

# Example

```vim
" Set default kind action.
call ddu#custom#patch_global({
\ 'kindParams': {
\   'extcmd': {
\     'runner': 'terminal',
\   },
\ },
\ 'kindOptions': {
\   'extcmd': {
\     'defaultAction': 'run',
\   },
\ },
\})
```
