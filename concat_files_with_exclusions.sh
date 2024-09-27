#!/bin/bash

# Directorio de origen
SOURCE_DIR="./"

# Archivo de salida
OUTPUT_FILE="output.txt"

# Patrones de exclusión
EXCLUDE_DIRS=("node_modules" ".git" "dist" "coverage")
EXCLUDE_FILES=(".gitignore" "package-lock.json" "concat_files_with_exclusions.sh" "output.txt" "yarn.lock")

# Vaciar el archivo de salida si ya existe
> "$OUTPUT_FILE"

# Construir el comando de exclusión para find manualmente
EXCLUDE_FIND_ARGS=""
for dir in "${EXCLUDE_DIRS[@]}"; do
    EXCLUDE_FIND_ARGS+=" -path \"$SOURCE_DIR$dir\" -prune -o"
done

# Añadir exclusión para archivos ocultos y especificar que se impriman solo los archivos
EXCLUDE_FIND_ARGS+=" -type f ! -name '.*' -print"

# Verificar el comando de exclusión
echo "Comando de exclusión: find \"$SOURCE_DIR\" $EXCLUDE_FIND_ARGS"

# Recorrer todos los archivos en el directorio y subdirectorios, excluyendo los especificados
eval "find \"$SOURCE_DIR\" $EXCLUDE_FIND_ARGS" | while read -r FILE; do
    # Mostrar el archivo actual para depuración
    echo "Procesando archivo: $FILE"

    # Obtener el nombre base del archivo para comprobar exclusión
    BASENAME=$(basename "$FILE")
    
    # Verificar si el archivo está en la lista de exclusión
    if [[ ! " ${EXCLUDE_FILES[@]} " =~ " $BASENAME " ]]; then
        # Agregar el nombre del archivo como encabezado
        echo "----- $FILE -----" >> "$OUTPUT_FILE"
        # Concatenar el contenido del archivo en el archivo de salida
        cat "$FILE" >> "$OUTPUT_FILE"
        # Agregar una nueva línea entre archivos para separar sus contenidos (opcional)
        echo "" >> "$OUTPUT_FILE"
    else
        echo "Archivo excluido: $BASENAME"
    fi
done

echo "Todos los archivos se han concatenado en $OUTPUT_FILE"
