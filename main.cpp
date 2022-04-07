#include <iostream>

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

#if __EMSCRIPTEN__
#include "emscripten/bind.h"
#include "emscripten/emscripten.h"
#else
#define EMSCRIPTEN_KEEPALIVE
#endif


int gWidth;
int gHeight;

int EMSCRIPTEN_KEEPALIVE generate_rendition_using_idb(std::string input_image_path, std::string output_image_path)
{
    // load image
    int width, height, channels;
    unsigned char *img = stbi_load(input_image_path.c_str(), &width, &height, &channels, 0);

    if (img == NULL)
    {
        std::cout << "error loading: " << output_image_path << std::endl;
        return 2;
    }
    std::cout << "image loaded" << std::endl;

    std::cout << "write output to: " << output_image_path << std::endl;
    // stbi_write_jpg(output_image_path.c_str(), width, height, channels, img, 100);
    gWidth = width;
    gHeight = height;
    return stbi_write_png(output_image_path.c_str(), width, height, channels, img, 0);
}

int EMSCRIPTEN_KEEPALIVE get_width()
{
    return gWidth;
}

int EMSCRIPTEN_KEEPALIVE get_height()
{
    return gHeight;
}

#if __EMSCRIPTEN__
int EMSCRIPTEN_KEEPALIVE main(int argc, char *argv[])
{
    std::cout << "c++ has loaded" << std::endl;
}
EMSCRIPTEN_BINDINGS(generate_rendition_using_idb)
{
    emscripten::function("generate_rendition_using_idb", &generate_rendition_using_idb);
    emscripten::function("get_width", &get_width);
    emscripten::function("get_height", &get_height);
}
#else
int main(int argc, char* argv[]){
    std::cout << "c++ has loaded" << std::endl;  
    if(argc < 3){
        std::cout << "usage: ./app input.psd output.png" << std::endl;
        return 1;
    }
    std::string input_image_path = std::string(argv[1]);
    std::string output_image_path = std::string(argv[2]);
    return generate_rendition_using_idb(input_image_path, output_image_path);
}
#endif //__EMSCRIPTEN__