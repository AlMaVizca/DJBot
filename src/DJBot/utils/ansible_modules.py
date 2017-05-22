import os
import re
import yaml


def _import_package(path, package):
    return __import__(path, globals(), locals(), package, -1)


def _get_sub_modules(path, category):
    """get all the modules inside the category"""
    module_path = _import_package(path, [category])
    python_path = path + '.' + category
    modules = {}
    module_list = []
    abs_path = eval('module_path.' + category + '.__path__[0]')
    sub_category = []
    module_files = os.listdir(abs_path)
    module_files.remove('__init__.py')
    for each in module_files:
        if re.search('.*\.py$', each) and not re.search('^_', each):
            module_name = re.sub('(.*)(\.py$)', '\g<1>', each)
            module_list.append(module_name)
            modules[module_name] = python_path

        if os.path.isdir(os.path.join(abs_path, each)):
            sub_category.append({'path': python_path, 'module': each})
    return (module_list, modules, sub_category)


def _get_modules(path, categories):
    """ Inspect all the categories in path and get all modules"""
    modules = {}
    modules_location = {}
    for category in categories:
        modules[category], location, sub_category = _get_sub_modules(
            path, category)
        modules_location.update(location)
        while len(sub_category) > 0:
            each = sub_category.pop()
            sub_modules, location, sub_sub_category = _get_sub_modules(
                each['path'], each['module'])
            modules_location.update(location)
            modules[category] += sub_modules
        modules[category].sort()
    return modules, modules_location


class AnsibleDocs():
    def __init__(self):
        ansible_path = 'ansible.modules'
        categories = _import_package(ansible_path,
                                     ['core', 'extras'])

        self.categories = os.listdir(categories.__path__[0])
        self.categories.remove('__init__.py')
        self.categories.remove('__init__.pyc')
        self.category_modules, self.modules = _get_modules(ansible_path,
                                                           self.categories)
        self.all_modules = self.modules.keys()
        self.all_modules.sort()

        # This is a hardcode for get all categories from the frontend
        self.categories.append('All')
        self.categories.sort()

    def get_categories(self):
        return {'categories': self.categories}

    def get_category(self, category):
        """ Get all modules in category """
        if category in self.category_modules:
            return {'category_name': category,
                    'modules': self.category_modules[category]}

        else:
            return {'category_name': category,
                    'modules': ['Not Found! What are you doing?']}

    def get_modules(self):
        return self.all_modules

    def get_module(self, module):
        docs = 'Module Not Found!'
        read_doc = _import_package(self.modules[module], [module])

        docs = eval('read_doc.' + module + '.DOCUMENTATION')
        examples = eval('read_doc.' + module + '.EXAMPLES')
        docs = yaml.load(docs)
        docs['examples'] = yaml.load(examples)
        return docs
