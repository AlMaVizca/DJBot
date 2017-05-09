import os


def _import_package(path, package):
    return __import__(path, globals(), locals(), package, -1)


def _get_modules(categories, ansible_path):
    read_path = 'ansible.modules.' + ansible_path
    module_path = _import_package(read_path, categories)
    modules = {}
    for category in categories:
        modules_path = 'module_path' + '.' + category + '.__path__[0]'
        modules[category] = []
        modules[category] += os.listdir(eval(modules_path))
        modules[category].remove('__init__.py')
        modules[category].remove('__init__.pyc')
    return modules


class AnsibleDocs():
    def __init__(self):
        categories = _import_package('ansible.modules',
                                     ['core', 'extras'])

        core = os.listdir(categories.core.__path__[0])
        extras = os.listdir(categories.extras.__path__[0])
        for each in [core, extras]:
            each.remove('__init__.py')
            each.remove('__init__.pyc')

        set_core = set(core)
        set_extras = set(extras)
        set_union = set_core.union(set_extras)
        self.categories = list(set_union)
        self.core_categories = list(set_union - set_extras)
        self.extras_categories = list(set_union - set_core)
        set_core = set(self.core_categories)
        set_extras = set(self.extras_categories)
        self.categories = list(set_union - set_extras - set_core)

        self.core_modules = _get_modules(self.core_categories, 'core')
        self.core_modules.update(_get_modules(self.categories, 'core'))

        self.extras_modules = _get_modules(self.extras_categories,
                                           'extras')
        self.extras_modules.update(_get_modules(self.categories,
                                                'extras'))

    def get_categories(self):
        all_of_them = self.categories + self.core_categories + \
                      self.extras_categories
        all_of_them.sort()
        return all_of_them

    def get_category(self, category):
        if category in self.categories:
            modules = list(set(self.core_modules[category] +
                               self.extras_modules[category]))
            modules.sort()
            return {category: modules}

        if category in self.core_categories:
            return {category: self.core_modules[category]}

        if category in self.extras_categories:
            return {category: self.extras_modules[category]}
        else:
            return []
