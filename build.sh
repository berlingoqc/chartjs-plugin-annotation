#! /bin/bash

npm run build && cp chartjs-plugin-annotation.js chartjs-plugin-annotation.min.js ../mercadex-mx/node_modules/chartjs-plugin-annotation/ && cp src/types/shape.js ../mercadex-mx/node_modules/chartjs-plugin-annotation/src/types/ 
