#!/usr/bin/env fish

set old_word "crosswalk"
set new_word "sauna"

for file in (tree -fi | grep $old_word)
    set new_name (echo $file | sed "s/$old_word/$new_word/g")
    mv -v $file $new_name
end

