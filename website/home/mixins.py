from .models import *
from django.db.models import Q
from .forms import *


class GetQuerysetMixin:
    def get_queryset(self):
        if self.kwargs['model'] == 'article':
            queryset = Article.objects.all()
        elif self.kwargs['model'] == 'category':
            queryset = Category.objects.all()
        elif self.kwargs['model'] == 'user':
            queryset = User.objects.all()
        elif self.kwargs['model'] == 'group':
            queryset = Group.objects.all()
        return queryset


class GetFormClassMixin:
    def get_form_class(self):
        if self.kwargs['model'] == 'article':
            form_class = ArticleForm
        elif self.kwargs['model'] == 'category':
            form_class = CategoryForm
        elif self.kwargs['model'] == 'user':
            form_class = UserForm
        elif self.kwargs['model'] == 'group':
            form_class = GroupForm
        return form_class


class GetAbsoluteUrlMixin:
    def get_success_url(self):
        if self.kwargs['model'] == 'user' or self.kwargs['model'] == 'group' or self.kwargs['model'] == 'category':
            url = reverse('adminList')
        elif self.kwargs['model'] == 'article':
            url = self.object.get_absolute_url()
        return url


class GetContextDataMixin:
    def get_context_data(self, **kwargs):
        qs = self.get_object()
        qs_lazy = qs.isi.replace('src', 'data-src')
        # print(qs_lazy)
        self.extra_context = {
            'qs_lazy': qs_lazy,
            'categories': Category.objects.all(),
            'curr_category': Category.objects.get(
                slug=self.kwargs['category']),
            'same_articles': Article.objects.filter(
                category__slug=self.kwargs['category']).exclude(Q(id=self.kwargs['pk']) | Q(published=False)).order_by('-updated')[:5],
            'comments': Comment.objects.filter(article__id=self.kwargs['pk'])[:10]
        }
        self.kwargs.update(self.extra_context)
        return super().get_context_data()
